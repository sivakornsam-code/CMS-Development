let currentPassword = "1234";

export function getStoredPassword(): string {
  return currentPassword;
}

export function setStoredPassword(password: string): void {
  currentPassword = password;
}

const AUTH_KEY = "cms_authed";

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === "1";
}

export function setAuthenticated(value: boolean): void {
  if (value) {
    sessionStorage.setItem(AUTH_KEY, "1");
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}
