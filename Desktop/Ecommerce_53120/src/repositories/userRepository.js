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

  async getUser(user) {
    try {
        const myUser = await this.dao.getUser(user);
        return myUser;
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
}

export default UserRepository;