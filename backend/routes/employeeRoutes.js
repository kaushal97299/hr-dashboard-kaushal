const express = require("express");
const app = express();
const Employee = require("../models/Employees");
const Candidate = require("../models/Candidates")

// POST /api/employees

// Add an employee
app.post("/add", async (req, res) => {
  try {
    const { id } = req.body;

    const newEmployee = new Employee({ candidateId: id });

    // console.log(newEmployee)
    await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully", employee: newEmployee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding employee", error: error.message });
  }
});

// Get all employees
app.get("/all", async (req, res) => {
  try {
    const employees = await Employee.find({}).populate('candidateId').lean();

    const flattened = employees.map(emp => {

      if (!emp.candidateId) return emp;

      const { candidateId, ...rest } = emp;
      const { position, ...candidateData } = candidateId;

      return {
        ...rest,
        ...candidateData
      };
    });

    res.status(200).json(flattened);
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ message: "Error fetching employees", error: error.message });
  }
});
// Backend route example
app.patch('/position/:id', async (req, res) => {
   console.log("PATCH request received at /position/:id");
  try {
    const { id } = req.params; 
    console.log("line54", id);

    const updatedData = req.body?.formData || req.body || {};
    // console.log("line57", updatedData);

    //  Step 1: Find employee by _id
     const employee = await Employee.findOne({ candidateId: id });
    // const employee = await Employee.findById(id);
    // console.log("line61", employee);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    //  Step 2: Update allowed fields
    const allowedFields = ["position", "attendenceStatus", "task", "department", "dateOfJoining"];
    allowedFields.forEach(field => {
      if (updatedData[field] !== undefined) {
        employee[field] = updatedData[field];
      }
    });
    console.log("Updated position:", updatedData.position);


    const updatedEmployee = await employee.save();
    // console.log("line78", updatedEmployee)

    return res.status(200).json(updatedEmployee);

  } catch (error) {
    console.error("PATCH /api/employees/position/:id error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});




// Delete employee
app.delete('/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const deletedEmp = await Employee.findOneAndDelete({candidateId : cid});
    if (!deletedEmp) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Updated GET /present with candidateId population
app.get('/present', async (req, res) => {
  try {
    const presentEmployees = await Employee.find({ attendenceStatus: 'present' })
      .populate('candidateId', 'name'); 

    console.log("Fetched Present Employees with Names:", JSON.stringify(presentEmployees, null, 2));

    return res.status(200).json(presentEmployees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Error fetching employees" });
  }
});




module.exports = app;
