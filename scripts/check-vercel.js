if (process.env.VERCEL_ENV === 'production') {
  await import('./check-production.js');
} else {
  console.log('Preview: execute check:production antes de promover a produção.');
}
