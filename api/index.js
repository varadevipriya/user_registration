const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); 

const uri = 'mongodb+srv://devipriyaakkineni:7989206807@cluster0.alhki.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
  },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
});

const User = mongoose.model('User', userSchema);

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Address = mongoose.model('Address', addressSchema);

app.post('/users', async (req, res) => {
  const { name, street, city, state, country } = req.body;

  try {
    let user = await User.findOne({ name });

    if (!user) {
      user = await User.create({ name });
    }

    const address = await Address.create({
      street,
      city,
      state,
      country,
      userId: user._id, 
    });

    user.addresses.push(address._id);
    await user.save();

    res.status(201).json({ message: 'User registered successfully!', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('addresses'); 
    res.status(200).json(users); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

app.delete('/users/:userId/addresses/:addressId', async (req, res) => {
    const { userId, addressId } = req.params;
  
    try {
      await Address.deleteOne(
        { _id: addressId },
      );
  
      res.status(200).json({ message: 'Address deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting address', error });
    }
  });
  

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
