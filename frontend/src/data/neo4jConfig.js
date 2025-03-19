import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  import.meta.env.VITE_NEO4J_URI,
  neo4j.auth.basic(
    import.meta.env.VITE_NEO4J_USERNAME,
    import.meta.env.VITE_NEO4J_PASSWORD
  )
);

export const runQuery = async (cypher, params = {}) => {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } finally {
    await session.close();
  }
};

export const closeDriver = async () => {
  await driver.close();
};
