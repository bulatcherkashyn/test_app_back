import { UserRoles } from '@app/users/models/User';

export const availableOperations = {
  getUsers: 'getUsers',
  updateUser: 'updateUser',
};
export const permissions = {
  [UserRoles.ADMIN]: [availableOperations.getUsers],
  [UserRoles.BOSS]: [availableOperations.getUsers, availableOperations.updateUser],
  [UserRoles.REGULAR]: [availableOperations.getUsers],
};
