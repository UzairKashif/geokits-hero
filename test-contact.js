const testContactForm = async () => {
  const testData = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    phone: "+1234567890",
    company: "Test Company",
    jobTitle: "Developer",
    serviceInterest: "Web Development",
    projectDescription: "This is a test submission to check if emails are working",
    budget: "$5,000-$10,000",
    hearAbout: "Google Search",
    subscribe: true
  };

  try {
    console.log('Sending test request to contact API...');
    
    const response = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('✅ SUCCESS: Email sent successfully!');
    } else {
      console.log('❌ ERROR: Failed to send email');
    }
  } catch (error) {
    console.error('❌ REQUEST ERROR:', error.message);
  }
};

testContactForm();
