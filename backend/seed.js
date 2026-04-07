const mongoose = require('mongoose');
const User = require('./models/User');
const Photographer = require('./models/Photographer');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Only connect if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to database for seeding...');
    } else {
      console.log('Using existing database connection...');
      // Wait for connection to be ready
      if (mongoose.connection.readyState === 2) {
        await new Promise(resolve => {
          const checkState = setInterval(() => {
            if (mongoose.connection.readyState === 1) {
              clearInterval(checkState);
              resolve();
            }
          }, 100);
        });
      }
    }

    // Only seed if database is empty
    const photographerCount = await Photographer.countDocuments();
    if (photographerCount > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }
    
    console.log('Seeding database with photographers...');
    
    // Clear existing data carefully
    try {
      await Photographer.deleteMany({});
      console.log('Cleared existing photographers');
    } catch (error) {
      console.log('No photographers to clear');
    }
    
    try {
      await User.deleteMany({});
      console.log('Cleared existing users');
    } catch (error) {
      console.log('No users to clear');
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@quantumpix.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Seed photographers with photos
    const photographers = [
      {
        name: 'John Photographer',
        email: 'john@photographer.com',
        profileImage: 'https://randomuser.me/api/portraits/men/13.jpg',
        bio: 'Professional wedding and event photographer with 6 years of experience capturing timeless moments.',
        location: 'Mumbai, India',
        price: 2500,
        categories: ['wedding', 'event', 'portrait'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=900&q=80',
            publicId: 'john1',
            caption: 'Elegant wedding ceremony'
          },
          {
            url: 'https://images.unsplash.com/photo-1496346651079-6ca5cb67f42f?auto=format&fit=crop&w=900&q=80',
            publicId: 'john2',
            caption: 'Intimate couple portrait'
          }
        ],
        rating: 4.8,
        totalReviews: 38,
        experience: 6,
        categoriesLabel: ['wedding', 'event', 'portrait']
      },
      {
        name: 'Maya Lens',
        email: 'maya@photographer.com',
        profileImage: 'https://randomuser.me/api/portraits/women/15.jpg',
        bio: 'Fashion and portrait specialist creating cinematic imagery for high-end clients.',
        location: 'New Delhi, India',
        price: 3200,
        categories: ['fashion', 'portrait', 'event'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
            publicId: 'maya1',
            caption: 'Fashion editorial shoot'
          },
          {
            url: 'https://images.unsplash.com/photo-1512418490979-92798cec8b88?auto=format&fit=crop&w=900&q=80',
            publicId: 'maya2',
            caption: 'Studio portrait'
          }
        ],
        rating: 4.9,
        totalReviews: 52,
        experience: 7,
        categoriesLabel: ['fashion', 'portrait', 'event']
      },
      {
        name: 'Aarav Clicks',
        email: 'aarav@photographer.com',
        profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        bio: 'Creative storyteller capturing corporate events, product launches and lifestyle moments.',
        location: 'Bengaluru, India',
        price: 2200,
        categories: ['corporate', 'event', 'portrait'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
            publicId: 'aarav1',
            caption: 'Corporate event coverage'
          },
          {
            url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
            publicId: 'aarav2',
            caption: 'Conference keynote photography'
          }
        ],
        rating: 4.7,
        totalReviews: 29,
        experience: 5,
        categoriesLabel: ['corporate', 'event', 'portrait']
      },
      {
        name: 'Priya Frames',
        email: 'priya@photographer.com',
        profileImage: 'https://randomuser.me/api/portraits/women/23.jpg',
        bio: 'Luxury wedding and family photographer with a passion for bright, elegant imagery.',
        location: 'Hyderabad, India',
        price: 2800,
        categories: ['wedding', 'birthday', 'fashion'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
            publicId: 'priya1',
            caption: 'Joyful wedding moments'
          },
          {
            url: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&w=900&q=80',
            publicId: 'priya2',
            caption: 'Fashion editorial look'
          }
        ],
        rating: 4.85,
        totalReviews: 34,
        experience: 6,
        categoriesLabel: ['wedding', 'birthday', 'fashion']
      },
      {
        name: 'Neha Shutter',
        email: 'neha@photographer.com',
        profileImage: 'https://randomuser.me/api/portraits/women/28.jpg',
        bio: 'Lifestyle and portrait photographer known for warm storytelling and natural light portraits.',
        location: 'Pune, India',
        price: 2100,
        categories: ['portrait', 'portrait', 'event'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80',
            publicId: 'neha1',
            caption: 'Lifestyle portrait session'
          },
          {
            url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
            publicId: 'neha2',
            caption: 'Family moment photography'
          }
        ],
        rating: 4.6,
        totalReviews: 21,
        experience: 4,
        categoriesLabel: ['portrait', 'family', 'event']
      },
      {
        name: 'Rohan Pixels',
        email: 'rohan@photographer.com',
        profileImage: 'https://randomuser.me/api/portraits/men/45.jpg',
        bio: 'Commercial photographer with an eye for products, branding and creative marketing campaigns.',
        location: 'Chennai, India',
        price: 2700,
        categories: ['corporate', 'corporate', 'fashion'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
            publicId: 'rohan1',
            caption: 'Product photography showcase'
          },
          {
            url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
            publicId: 'rohan2',
            caption: 'Commercial brand portfolio'
          }
        ],
        rating: 4.75,
        totalReviews: 27,
        experience: 6,
        categoriesLabel: ['corporate', 'product', 'fashion']
      },
      {
        name: 'Ananya Clicks',
        email: 'ananya@photographer.com',
        profileImage: 'https://randomuser.me/api/portraits/women/47.jpg',
        bio: 'Artistic photographer specializing in creative portraits, editorial stories and lifestyle shoots.',
        location: 'Kolkata, India',
        price: 2400,
        categories: ['portrait', 'event', 'fashion'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
            publicId: 'ananya1',
            caption: 'Editorial portrait art'
          },
          {
            url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80',
            publicId: 'ananya2',
            caption: 'Lifestyle shoot'
          }
        ],
        rating: 4.8,
        totalReviews: 31,
        experience: 5,
        categoriesLabel: ['portrait', 'event', 'fashion']
      },
      {
        name: 'Riya Shutter',
        email: 'riya@photographer.com',
        profileImage: 'https://randomuser.me/api/portraits/women/55.jpg',
        bio: 'Portrait and lifestyle expert capturing authentic moments with a modern aesthetic.',
        location: 'Chennai, India',
        price: 2600,
        categories: ['portrait', 'portrait', 'fashion'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1492599122971-49ec1a13b71f?auto=format&fit=crop&w=900&q=80',
            publicId: 'riya1',
            caption: 'Lifestyle portrait series'
          },
          {
            url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80',
            publicId: 'riya2',
            caption: 'Fashion-focused portrait'
          },
          {
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
            publicId: 'riya3',
            caption: 'Creative studio portrait'
          }
        ],
        rating: 4.75,
        totalReviews: 41,
        experience: 5,
        categoriesLabel: ['portrait', 'lifestyle', 'fashion']
      },
      {
        name: 'Karan Pixel',
        email: 'karan@photographer.com',
        profileImage: 'https://randomuser.me/api/portraits/men/57.jpg',
        bio: 'Commercial photographer specialising in product shoots, food photography and branding campaigns.',
        location: 'Pune, India',
        price: 2900,
        categories: ['corporate', 'corporate', 'event'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
            publicId: 'karan1',
            caption: 'Food styling shoot'
          },
          {
            url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=900&q=80',
            publicId: 'karan2',
            caption: 'Product branding imagery'
          }
        ],
        rating: 4.6,
        totalReviews: 27,
        experience: 8,
        categoriesLabel: ['commercial', 'product', 'food']
      },
      {
        name: 'Neha Focus',
        email: 'nehafocus@photographer.com',
        profileImage: 'https://randomuser.me/api/portraits/women/60.jpg',
        bio: 'Family and engagement photographer who creates timeless keepsakes for every generation.',
        location: 'Kolkata, India',
        price: 2400,
        categories: ['portrait', 'wedding', 'portrait'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80',
            publicId: 'neha1',
            caption: 'Family portrait session'
          },
          {
            url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80',
            publicId: 'neha2',
            caption: 'Engagement moments'
          }
        ],
        rating: 4.8,
        totalReviews: 36,
        experience: 6,
        categoriesLabel: ['family', 'engagement', 'portrait']
      },
      {
        name: 'Sameer Studio',
        email: 'sameer@photographer.com',
        profileImage: 'https://randomuser.me/api/portraits/men/66.jpg',
        bio: 'Event and travel photographer with a flair for dynamic storytelling and travel campaigns.',
        location: 'Jaipur, India',
        price: 3100,
        categories: ['event', 'event', 'wedding'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
            publicId: 'sameer1',
            caption: 'Destination wedding coverage'
          },
          {
            url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
            publicId: 'sameer2',
            caption: 'Travel story photography'
          }
        ],
        rating: 4.9,
        totalReviews: 48,
        experience: 7,
        categoriesLabel: ['event', 'travel', 'wedding']
      }
    ];

    for (const photographerData of photographers) {
      const user = new User({
        name: photographerData.name,
        email: photographerData.email,
        password: 'photo123',
        role: 'photographer',
        profileImage: photographerData.profileImage,
        location: photographerData.location
      });
      await user.save();

      const newPhotographer = new Photographer({
        userId: user._id,
        bio: photographerData.bio,
        location: photographerData.location,
        price: photographerData.price,
        categories: photographerData.categories,
        portfolio: photographerData.portfolio,
        rating: photographerData.rating,
        totalReviews: photographerData.totalReviews,
        experience: photographerData.experience,
        isActive: true,
        equipment: ['Canon EOS R6', 'Nikon Z7 ii', 'Profoto lighting kit'],
        socialLinks: {
          instagram: `https://instagram.com/${photographerData.name.toLowerCase().replace(/\s+/g, '')}`,
          website: `https://www.${photographerData.name.toLowerCase().replace(/\s+/g, '')}.com`
        }
      });
      await newPhotographer.save();
      console.log(`Photographer ${photographerData.name} created`);
    }

    // Create sample customer
    const customerUser = new User({
      name: 'Jane Customer',
      email: 'jane@customer.com',
      password: 'customer123',
      role: 'customer'
    });
    await customerUser.save();
    console.log('Sample customer created');

    console.log('Database seeded successfully!');
    console.log('\nSample accounts:');
    console.log('Admin: admin@quantumpix.com / admin123');
    console.log('Customer: jane@customer.com / customer123');
    photographers.forEach((photographer) => {
      console.log(`Photographer: ${photographer.email} / photo123`);
    });

  } catch (error) {
    console.error('Seeding error:', error);
    throw error; // Re-throw so the API endpoint can catch it
  } finally {
    // Don't close connection when called from API
    if (require.main === module) {
      await mongoose.connection.close();
    }
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };