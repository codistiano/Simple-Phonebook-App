const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the required parameters!');
    process.exit(1);
}

const password = process.argv[2]

const url = `mongodb+srv://noteApp:${password}@cluster0.jjqqao5.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`


mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
    name: String,
    phone: String
});

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

if (process.argv.length === 3) {
    Phonebook.find().then((phonebooks) => {
        console.log('Phonebook entries:');
        phonebooks.forEach((phonebook) => {
            console.log(phonebook.name, phonebook.phone);
        });
        mongoose.connection.close();
    }).catch((err) => {
        console.log('Error retrieving phonebook entries:', err);
        mongoose.connection.close();
    });
} else if (process.argv.length > 3) {
    const name = process.argv[3];
    const phone = process.argv[4];
    
    const newPhonebook = new Phonebook({
        name: name,
        phone: phone
    });
    
    newPhonebook.save().then(() => {
        console.log(`Added ${name} with phone number ${phone} to phonebook.`);
        mongoose.connection.close();
    }).catch((err) => {
        console.log('Error adding phonebook entry:', err);
        mongoose.connection.close();
    });
}
