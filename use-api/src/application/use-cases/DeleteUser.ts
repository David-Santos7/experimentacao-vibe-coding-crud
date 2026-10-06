import { UserNotFoundError } from "../errors/UserNotFoundError.js";
import type { UserRepository } from "../repositories/UserRepository.js";

export class DeleteUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.userRepository.deleteById(id);
  }
}
