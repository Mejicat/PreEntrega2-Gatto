import UserDto from '../dao/dto/userDTO.js'

class UserRepository {
  constructor(dao) {
      this.dao = dao;
  }

  async addUser(user, email, password) {
      try {
        const newUser = await this.dao.addUser(user, email, password);
        return new UserDto(newUser);
      } catch (error) {
        throw new Error(error.message);
      }
  }

  async loginUser(user, password) {
      try {
          const myUser = await this.dao.loginUser(user, password);
          return myUser;
      } catch (error) {
          throw new Error(error.message);
      }
  }

  async getUsers() {
    try {
      const users = await this.dao.getUsers();
      return users.map(user => new UserDto(user));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findUserEmail(email) {
    try {
        const user = await this.dao.findUserEmail(email)
        return user;
    } catch (error) {
        throw new Error(error.message)
    }
  }

  async getUserById(userId) {
    try {
      const user = await this.dao.getUserById(userId);
      return new UserDto(user);
    } catch (error) {
      throw new Error(`User with ID ${userId} not found`);
    }
  }

  async registerUser(user) {
    try {
      const newUser = await this.dao.registerUser(user);
      return new UserDto(newUser);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async verifyUser(userId) {
    try {
      const user = await this.dao.verifyUser(userId);
      return new UserDto(user);
    } catch (error) {
      throw new Error(`Error al verificar usuario: ${error.message}`);
    }
  }

  async updateUserPassword(userId, newPassword) {
    try {
      const updatedUser = await this.dao.updateUserPassword(userId, newPassword);
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUserRole(userId, newRole) {
    try {
      const user = await this.dao.updateUserRole(userId, newRole);
      return new UserDto(user);
    } catch (error) {
      throw new Error(`Error updating user role: ${error.message}`);
    }
  }

  async deleteUserByEmail(email) {
    try {
      await this.dao.deleteUserByEmail(email);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}

export default UserRepository;