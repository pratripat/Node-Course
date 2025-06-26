
// getCustomer(1, (customer) => {
//   console.log('Customer: ', customer);
//   if (customer.isGold) {
//     getTopMovies((movies) => {
//       console.log('Top movies: ', movies);
//       sendEmail(customer.email, movies, () => {
//         console.log('Email sent...')
//       });
//     });
//   }
// });

async function sendMoviesToCustomer() {
  const customer = await getCustomer(1);
  console.log('Customer:', customer);
  if (customer.isGold) {
    const movies = await getTopMovies();
    console.log('Top movies:', movies);
    await sendEmail(customer.email, movies);
    console.log('Email sent...');
  }
}
sendMoviesToCustomer()

function getCustomer(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ 
        id: 1, 
        name: 'prat', 
        isGold: true, 
        email: 'email' 
      });
    }, 2000); 
  }) 
}

function getTopMovies() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(['movie1', 'movie2']);
    }, 2000);
  })
}

function sendEmail(email, movies, callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  })
}