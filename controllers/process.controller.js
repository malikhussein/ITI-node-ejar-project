import processModel from '../models/process.model.js';
import productModel from '../models/Product.model.js';
import userModel from '../models/user.model.js';

export default class Process {
  static async createProcess(req, res) {
    try {
      // * Check if request is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'no token provided' });
      }

      const { id: userId, role: userRole } = req.user;

      // * Check if the user exists
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      // * Check if the product exists
      const { productId } = req.params;
      const product = await productModel.findById(productId);

      if (!product) {
        return res.status(404).json({ message: 'product does not exist' });
      }

      // * Get the values from the body
      const { startDate, endDate, price } = req.body;

      const newProcess = new processModel({
        productId,
        renterId: userId,
        startDate,
        endDate,
        price,
      });
      const process = await newProcess.save();
      return res.status(201).json(process);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  static async getAllProcesses(req, res) {
    try {
      // * Check if request is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'no token provided' });
      }

      const { id: userId, role: userRole } = req.user;

      // * Check if the user sending the request exists
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      // * Check if the user is an admin
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'unauthorized user' });
      }

      const processes = await processModel.find();

      // * Check if there is any processes
      if (processes.length <= 0) {
        return res.status(404).json({ message: 'no processes were found' });
      }

      return res.status(200).json(processes);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  static async getProcess(req, res) {
    try {
      // * Check if request is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'no token provided' });
      }

      const { id: userId, role: userRole } = req.user;

      // * Check if the user exists
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      // * Check if the process exists
      const { id: processId } = req.params;
      const process = await processModel.findById(processId);
      if (!process) {
        return res.status(404).json({ message: 'process does not exist' });
      }

      // * Check if the user is an admin or the renter
      if (userRole !== 'admin' && userId !== process.renterId.toString()) {
        return res.status(403).json({ message: 'unauthorized user' });
      }

      return res.status(200).json(process);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  // ? Get all process by a user

  // ? Extent the duration

  static async updateStatus(req, res) {
    try {
      // * Check if request is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'no token provided' });
      }

      const { id: userId, role: userRole } = req.user;

      // * Check if the user sending the request exists
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      // * Check if the user is an admin
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'unauthorized user' });
      }

      // * Check if the process exists
      const { id: processId } = req.params;
      const process = await processModel.findById(processId);
      if (!process) {
        return res.status(404).json({ message: 'process does not exist' });
      }

      // * Check if the duration is still valid
      if (process.endDate < new Date()) {
        return res.status(403).json({ message: 'process is in progress' });
      }

      const { status } = req.body;

      // * Check if the status is provided
      if (!status) {
        return res.status(400).json({ message: 'status is required' });
      }

      // * Check if the status is valid
      const validStatuses = ['pending', 'canceled', 'in_progress', 'finished'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: 'status must be pending, canceled, in_progress or finished',
        });
      }

      // * Update the process status
      process.status = status;
      await process.save();

      return res.status(200).json(process);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  static async deleteProcess(req, res) {
    try {
      // * Check if request is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'no token provided' });
      }

      const { id: userId, role: userRole } = req.user;

      // * Check if the user sending the request exists
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      // * Check if the user is an admin
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'unauthorized user' });
      }

      // * Check if the process exists
      const { id: processId } = req.params;
      const process = await processModel.findById(processId);
      if (!process) {
        return res.status(404).json({ message: 'process does not exist' });
      }

      // * Check if the duration is still valid
      if (process.endDate < new Date()) {
        return res.status(403).json({ message: 'process is in progress' });
      }

      // * Delete the process
      await process.deleteOne();

      return res.status(200).json({ message: 'process deleted successfully' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }
}
