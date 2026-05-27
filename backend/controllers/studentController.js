const Student = require('../models/Student');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const deleteUploadedFile = async (filePath) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    console.error('Failed to delete uploaded CSV:', err.message);
  }
};

// Upload CSV and seed student records
exports.uploadStudentCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No CSV file uploaded' });

  const filePath = path.isAbsolute(req.file.path)
    ? req.file.path
    : path.join(__dirname, '..', req.file.path);
  const results = [];
  const errors = [];

  const stream = fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.RegNo && row.Email && row.Name) {
        results.push({
          RegNo: row.RegNo.trim(),
          Name: row.Name.trim(),
          Email: row.Email.trim().toLowerCase(),
          Phone: row.Phone?.trim(),
          Branch: row.Branch?.trim(),
          Year: row.Year?.trim(),
        });
      } else {
        errors.push({ row: row.RegNo || 'unknown', error: 'Missing required header values (RegNo, Name, Email)' });
      }
    })
    .on('end', async () => {
      let inserted = 0;
      let skipped = 0;

      for (const row of results) {
        try {
          const exists = await Student.findOne({ $or: [{ regNo: row.RegNo }, { email: row.Email }] });
          if (exists) {
            skipped++;
            continue;
          }
          await Student.create({
            regNo: row.RegNo,
            name: row.Name,
            email: row.Email,
            phone: row.Phone,
            branch: row.Branch,
            year: row.Year,
          });
          inserted++;
        } catch (e) {
          errors.push({ row: row.RegNo, error: e.message });
        }
      }

      await deleteUploadedFile(filePath);
      res.status(200).json({ success: true, message: `CSV processed. Inserted: ${inserted}, Skipped: ${skipped}`, errors });
    })
    .on('error', async (err) => {
      console.error('CSV upload error:', err);
      await deleteUploadedFile(filePath);
      res.status(500).json({ success: false, message: 'CSV parse or file error', error: err.message });
    });
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const { search, branch, year, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { regNo: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    if (branch) query.branch = branch;
    if (year) query.year = year;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query).skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
    res.status(200).json({ success: true, total, page: Number(page), students });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get student profile
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    res.status(200).json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update student profile
exports.updateStudentProfile = async (req, res) => {
  try {
    const { name, phone, branch, year } = req.body;
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    student.name = name ?? student.name;
    student.phone = phone ?? student.phone;
    student.branch = branch ?? student.branch;
    student.year = year ?? student.year;

    await student.save();
    res.status(200).json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Student removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
