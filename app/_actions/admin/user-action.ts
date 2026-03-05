"use server";

import { createUser, updateUser, deleteUser } from "@/lib/api/admin/user";

export const handleAdminCreateUser = async (formData: FormData) => {
  return createUser(formData);
};

export const handleAdminUpdateUser = async (userId: string, formData: FormData) => {
  return updateUser(userId, formData);
};

export const handleAdminDeleteUser = async (userId: string) => {
  return deleteUser(userId);
};
