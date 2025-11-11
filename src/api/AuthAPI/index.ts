import { login } from "./login";
import { logout } from "./logout";
import { signup } from "./signup";
import { getProfile, useGetProfile } from "./getProfile";
import { updateProfile, useUpdateProfile } from "./updateProfile";
import { validatePassword } from "./validatePassword";

const AuthAPI = {
  login,
  logout,
  signup,
  getProfile,
  useGetProfile,
  updateProfile,
  useUpdateProfile,
  validatePassword
};

export default AuthAPI;
