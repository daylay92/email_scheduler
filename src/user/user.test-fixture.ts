import { UserData } from './user.model';

export const mockNewUsers: UserData[] = [];
export let currentEmail: string = '';
export const mockSchema = {
  return: this,
  page(offset: number, count: number): UserData[] {
    return mockNewUsers.slice(offset, offset + count);
  },
  search() {
    return this;
  },
  count() {
    return mockNewUsers.length;
  },
  where() {
    return this;
  },
  eq(email: string) {
    currentEmail = email;
    return this;
  },
  firstId(): UserData | undefined {
    return mockNewUsers.find(user => user.email === currentEmail);
  },
  createEntity(user: UserData): UserData {
    const payload = {
      ...user,
      entityId: String(mockNewUsers.length + 1),
    };
    mockNewUsers.push(payload);
    return payload;
  },
  save(user: UserData): UserData {
    return user;
  },
  returnAll(): UserData[] {
    return mockNewUsers;
  },
  fetch(id: string): UserData | undefined {
    return mockNewUsers.find(user => user.entityId === id);
  },
  remove(id: string): void {
    const findIndex = mockNewUsers.findIndex(({ entityId }) => entityId === id);
    mockNewUsers.splice(findIndex, 1);
  },
};
