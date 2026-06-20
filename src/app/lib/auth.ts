let currentPassword = "1234";

export function getStoredPassword(): string {
  return currentPassword;
}

export function setStoredPassword(password: string): void {
  currentPassword = password;
}

const AUTH_KEY = "cms_authed";
const ROLE_KEY = "cms_role";

export type AdminRole = "super" | "transport" | "immigration";

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === "1";
}

export function setAuthenticated(value: boolean): void {
  if (value) {
    sessionStorage.setItem(AUTH_KEY, "1");
  } else {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(ROLE_KEY);
  }
}

export function getAdminRole(): AdminRole | null {
  return sessionStorage.getItem(ROLE_KEY) as AdminRole | null;
}

export function setAdminRole(role: AdminRole): void {
  sessionStorage.setItem(ROLE_KEY, role);
}
