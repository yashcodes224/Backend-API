const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signUp = async(req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            mobile: req.body.mobile,
            isAdmin: req.body.isAdmin || false  
        });

        const newUser = await user.save();
        res.status(201).json({message: 'User registration successful!', data:newUser});

    }catch(err){
        res.status(400).json({message: err.message});
    }
}



const login = async(req, res) => {
    try {
            
    const {email, password} = req.body;
    
    const user = await User.findOne({email: email});
    if(!user){
        res.status(400).json({message: "User not found"});
    }else{
        // Check the password
        const isMatch = await bcrypt.compare(password, user.password)
        
        if(!isMatch){
            res.status(400).json({message: 'Invalid password'});
        }else{
            const token = jwt.sign({id: user._id, isAdmin:user.isAdmin}, process.env.JWT_SECRET, {expiresIn:
                '1h'});
            res.status(200).json({message: 'Login suceesful!', data: {token: token, user: {id:
                user._id, email:user.email, name: user.name}}});
        }
    }
    } catch (error) {
        res.status(400).json({message: err.message});
    }
    
}



const details = async(req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            res.status(400).json({ message: 'User not found' });
        }else{
            
            const { password, ...others } = user._doc;
            res.status(200).json({message: 'User details fetched successfully!', data: others });
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }
    
}


 
const updateDetails = async(req, res) => {
    try {
        const updates = req.body;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user._doc;

        res.status(200).json({ message: 'User details updated', data: userWithoutPassword });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}



const deleteUser = async (req, res) => {
    try {
        console.log('Delete user called');
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User deleted');
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
};



module.exports = {
    signUp,
    login,
    details,
    updateDetails,
    deleteUser
};