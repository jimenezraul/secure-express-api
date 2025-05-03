import sequelize from '../db/db';

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // `force: true` will drop and recreate tables on every restart (use with caution)
    console.log('Database synced!');
  } catch (error) {
    console.error('Error syncing the database:', error);
  }
};

export default syncDatabase;
