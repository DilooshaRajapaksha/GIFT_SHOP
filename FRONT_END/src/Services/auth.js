export const auth = {
  getToken: () => localStorage.getItem('jwt') || sessionStorage.getItem('jwt'),
  getRole: () => localStorage.getItem('role') || sessionStorage.getItem('role'),
  getUserId: () => localStorage.getItem('userId') || sessionStorage.getItem('userId'),
  isLoggedIn: () => !!auth.getToken(),
  isAdmin: () => auth.getRole()?.toUpperCase().replace('ROLE_', '') === 'ADMIN',
  logout: () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    sessionStorage.removeItem('jwt')
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('userId')
  }
}