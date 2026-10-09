async function verify() {
  try {
    const catRes = await fetch('http://localhost:3000/api/careers/categories');
    const categoriesJson = await catRes.json();
    console.log('Categories count:', categoriesJson.data.length, categoriesJson.data);

    const careersRes = await fetch('http://localhost:3000/api/careers');
    const careersJson = await careersRes.json();
    const careers = careersJson.data;
    console.log(`Total careers returned by /api/careers: ${careers.length}`);
    if (careers.length > 0) {
      console.log('Sample career #1:', {
        name: careers[0].name,
        category: careers[0].category_code,
        avgSalary: careers[0].average_salary,
        growth: careers[0].growth_rate,
        skills: careers[0].skills_required?.slice(0, 3),
      });
    }

    const testDiploma = await fetch('http://localhost:3000/api/careers?category=diploma');
    const diplomaCareers = (await testDiploma.json()).data;
    console.log(`Diploma careers returned: ${diplomaCareers.length}`);

    const testGovt = await fetch('http://localhost:3000/api/careers?category=government_defence');
    const govtCareers = (await testGovt.json()).data;
    console.log(`Government & Defence careers returned: ${govtCareers.length}`);
  } catch (err: any) {
    console.error('API Verification error:', err.message);
  }
}

verify();
