import neo4j, { Driver, Session } from 'neo4j-driver';

// Neo4j connection configuration
const NEO4J_URI = import.meta.env.VITE_NEO4J_URI || 'neo4j://localhost:7687';
const NEO4J_USER = import.meta.env.VITE_NEO4J_USERNAME || 'neo4j';
const NEO4J_PASSWORD = import.meta.env.VITE_NEO4J_PASSWORD || 'your-password';

let driver: Driver;

export const initDriver = () => {
  try {
    driver = neo4j.driver(
      NEO4J_URI,
      neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
    );
    console.log('Neo4j driver initialized');
    return driver;
  } catch (error) {
    console.error('Error initializing Neo4j driver:', error);
    throw error;
  }
};

export const getDriver = () => {
  if (!driver) {
    return initDriver();
  }
  return driver;
};

export const closeDriver = async () => {
  if (driver) {
    await driver.close();
    driver = undefined as any;
  }
};

export const runQuery = async (query: string, params = {}) => {
  const session: Session = getDriver().session();
  try {
    const result = await session.run(query, params);
    return result.records;
  } catch (error) {
    console.error('Error running query:', error);
    throw error;
  } finally {
    await session.close();
  }
};

// Initialize the driver when the module is loaded
initDriver(); 