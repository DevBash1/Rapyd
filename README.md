# Create Wallet

Demo

```javascript
let wallet = new Wallet();
let data = {
    "first_name": "Dev",
    "last_name": "Bash",
    "email": "bash@email.com",
    "ewallet_reference_id": wallet.getRef("Dev Bash"),
    "metadata": {
        "merchant_defined": true
    },
    "phone_number": "+14155551111",
    "type": "person",
    "contact": {
        "phone_number": "+14155551111",
        "email": "bash@gmail.com",
        "first_name": "Dev",
        "last_name": "Bash",
        "mothers_name": "Mom",
        "contact_type": "personal",
        "address": {
            "name": "Home",
            "line_1": "123 Main Street",
            "line_2": "",
            "line_3": "",
            "city": "Anytown",
            "state": "NY",
            "country": "US",
            "zip": "12345",
            "phone_number": "+14155551111",
            "metadata": {},
            "canton": "",
            "district": ""
        },
        "identification_type": "PA",
        "identification_number": "1234567890",
        "date_of_birth": "11/22/2000",
        "country": "US",
        "nationality": "US",
        "metadata": {
            "merchant_defined": true
        },
    }
};

wallet.create(data, function(response,err){
    if(err){
        console.log("Error: " + JSON.stringify(err));
        return false;
    }
    console.log(response);
})
```

```javascript
let wallet = new Wallet();
wallet.get("ewallet_f03192e4cc94ebfb1ee0433ab78f652d", function(response,err){
    console.log(err);
    console.log(response);
})
```