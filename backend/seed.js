const mongoose = require('mongoose');
const User = require('./models/User');
const Photographer = require('./models/Photographer');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to database for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Photographer.deleteMany({});

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
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
        bio: 'Professional wedding and event photographer with 6 years of experience capturing timeless moments.',
        location: 'Mumbai, India',
        price: 2500,
        categories: ['wedding', 'event', 'portrait'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
            publicId: 'john1',
            caption: 'Elegant wedding ceremony'
          },
          {
            url: 'https://images.unsplash.com/photo-1494173853739-c21f58b16055?auto=format&fit=crop&w=900&q=80',
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
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
        bio: 'Fashion and portrait specialist creating cinematic imagery for high-end clients.',
        location: 'Delhi, India',
        price: 3200,
        categories: ['fashion', 'portrait', 'event'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
            publicId: 'maya1',
            caption: 'Fashion editorial shoot'
          },
          {
            url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
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
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
        bio: 'Creative storyteller capturing corporate events, product launches and lifestyle moments.',
        location: 'Bengaluru, India',
        price: 2200,
        categories: ['corporate', 'event', 'portrait'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
            publicId: 'aarav1',
            caption: 'Corporate event coverage'
          },
          {
            url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80',
            publicId: 'aarav2',
            caption: 'Conference and keynote photography'
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
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
        bio: 'Luxury wedding and family photographer with a passion for bright, elegant imagery.',
        location: 'Hyderabad, India',
        price: 2800,
        categories: ['wedding', 'birthday', 'fashion'],
        portfolio: [
          {
            url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
            publicId: 'priya1',
            caption: 'Joyful wedding moments'
          },
          {
            url: 'https://images.unsplash.com/photo-1533694091034-8a39e2b58123?auto=format&fit=crop&w=900&q=80',
            publicId: 'priya2',
            caption: 'Fashion editorial look'
          }
        ],
        rating: 4.85,
        totalReviews: 34,
        experience: 6,
        categoriesLabel: ['wedding', 'birthday', 'fashion']
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
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();