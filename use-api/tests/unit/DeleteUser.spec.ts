import { beforeEach, describe, expect, it } from "vitest";

import { DeleteUser } from "../../src/application/use-cases/DeleteUser.js";
import { User } from "../../src/domain/entities/User.js";
import { InMemoryUserRepository } from "../doubles/InMemoryUserRepository.js";

describe("DeleteUser", () => {
  let repository: InMemoryUserRepository;
  let deleteUser: DeleteUser;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    deleteUser = new DeleteUser(repository);
  });

  it("should delete a user", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    const user = new User({
      id: "user-1",
      name: "Ana Silva",
      email: "ana@example.com",
      role: "USER",
      createdAt: date,
      updatedAt: date,
    });

    await repository.create(user);

    await deleteUser.execute(user.id);

    const storedUser = await repository.findById(user.id);

    expect(storedUser).toBeNull();
  });

  it("should reject when user does not exist", async () => {
    await expect(deleteUser.execute("non-existing-user-id")).rejects.toThrow(
      "User not found.",
    );
  });
});
