const { electronicBilling } = require('./src/services/arcaClient');

async function test() {
  try {
    const status = await electronicBilling.getServerStatus();

    console.log('OK:', status);
  } catch (e) {
    console.error('ERROR:', e);
  }
}

test();