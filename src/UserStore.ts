import { types } from 'mobx-state-tree';

const User = types.model('User', {
  id: types.identifierNumber,
  name: types.string,
  username: types.string,
  isEditing: types.optional(types.boolean, false), // Режим редагування
  editedName: types.optional(types.string, ''), // Редагування
  isBlocked: types.optional(types.boolean, false), // Блокування

}).actions(self => ({

  setName(newName: string) {
    self.editedName = newName;
  },
  toggleBlock() {
    self.isBlocked = !self.isBlocked; // Блокування за вимикачем
  },
}));


const UserStore = types
  .model('UserStore', {
    users: types.array(User),
  })
  .actions(self => ({
    addUser(id: number, name: string, username: string) {
        const newUser = User.create({
            id,
            name,
            username,
          });
          self.users.push(newUser);
        },
    
    removeUser(user: typeof User.Type) {
      self.users.remove(user);
    },
    toggleEdit(user: typeof User.Type) {
        user.isEditing = !user.isEditing;
        if (user.isEditing) {
            user.setName(user.name); // Редагування імені
          }
      },
      updateName(user: typeof User.Type) {
        user.name = user.editedName; // Оновлення ім'я
        user.isEditing = false;
      },

  }));

export type IUserStore = typeof UserStore.Type; 

export { UserStore };


