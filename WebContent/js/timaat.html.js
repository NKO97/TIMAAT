//  <!-- focus username field in login mask -->
$('#timaat-login-modal').on('shown.bs.modal', function() {
  $('#timaat-login-user').focus();
});

// <!-- client side form validation -->
var mediumFormMetadata = $('#timaat-mediadatasets-metadata-form');
var mediumFormMetadataValidator = $('#timaat-mediadatasets-metadata-form').validate({
  rules: {
    displayTitle: {
      required: true,
      minlength: 3,
      maxlength: 200
    },
    displayTitleLanguageId: {
      required: true,
    },
    typeId: {
      required: true,
    },
    // releaseDate: {
    //   dateISO: true,
    // },
    // sourceLastAccessed: {
    //   dateISO: true,
    // },
    // length: {

    // },
    width: {
      number: true,
      max: 65535
    },
    height: {
      number: true,
      max: 65535
    },
    bitDepth: {
      number: true,
      max: 65535
    },
    frameRate: {
      number: true,
      max: 65535
    },
    dataRate: {
      number: true,
      max: 65535
    },
    totalBitrate: {
      number: true,
      max: 65535
    }       
  },
  messages: {
    displayTitle: {
      required: "Enter a title (min length: 3)",
      minlength: "Title too short: min length is 3",
      maxlength: "Title is too long: max length is 200"
    },
    displayTitleLanguageId: {
      required: "Please provide the title's language"
    },
    typeId: {
      required: "Please provide the type of the medium"
    },
    // releaseDate: {
    //   dateISO: "Please provide a valid date"
    // },
    // sourceLastAccessed: {
    //   dateISO: "Please provide a valid date"
    // },
    // length: {

    // },
    width: {
      number: "Please provide a valid number",
      max: "Please provide a value not greater 65535"
    },
    height: {
      number: "Please provide a valid number",
      max: "Please provide a value not greater 65535"
    },
    bitDepth: {
      number: "Please provide a valid number",
      max: "Please provide a value not greater 65535"
    },
    frameRate: {
      number: "Please provide a valid number",
      max: "Please provide a value not greater 65535"
    },
    dataRate: {
      number: "Please provide a valid number",
      max: "Please provide a value not greater 65535"
    },
    totalBitrate: {
      number: "Please provide a valid number",
      max: "Please provide a value not greater 65535"
    }
  },
  submitHandler: function(mediumFormMetadata) {
    mediumFormMetadata.submit();
  },
});
var mediumFormTitles = $('#timaat-mediadatasets-medium-titles-form');
var mediumFormTitlesValidator = $('#timaat-mediadatasets-medium-titles-form').validate({
  rules: {
    title: {
      required: true,
      minlength: 3,
      maxlength: 200,
    },
    titleLanguageId: {
      required: true,
    },
  },
  messages: {
    displayTitle: {
      required: "Enter a title (min length: 3)",
      minlength: "Title too short: min length is 3",
      maxlength: "Title is too long: max length is 200"
    },
  },
  submitHandler: function(mediumFormTitles) {
    mediumFormTitles.submit();
  },
});
var mediumFormLanguageTracks = $('#timaat-mediadatasets-medium-languagetracks-form');
var mediumFormLanguageTracksValidator = $('#timaat-mediadatasets-medium-languagetracks-form').validate({
  rules: {
    languageTrackTypeId: {
      required: true,
    },
    languageTrackLanguageId: {
      required: true,
    },
  },
  submitHandler: function(mediumFormLanguageTracks) {
    mediumFormLanguageTracks.submit();
  },
});
var mediumFormActorRoles = $('#timaat-mediadatasets-medium-actorwithroles-form');
var mediumFormActorRolesValidator = $('#timaat-mediadatasets-medium-actorwithroles-form').validate({
  ignore: [],
  rules: {
    actorId: {
      required: true,
    },
    roleId: {
      required: true,
    },
  },
  messages: {
    actorId: {
      required: 'Please select an actor.'
    },
    roleId: {
      required: 'Please select at least one role.'
    }
  },
  submitHandler: function(mediumFormLanguageTracks) {
    mediumFormLanguageTracks.submit();
  },
})
var actorFormMetadata = $('#timaat-actordatasets-metadata-form');
var actorFormMetadataValidator = $('#timaat-actordatasets-metadata-form').validate({
  rules: {
    displayName: {
      required: true,
      minlength: 3,
      maxlength: 200
    },
    typeId: {
      required: true,
    }     
  },
  messages: {
    displayName: {
      required: "Enter a name (min length: 3)",
      minlength: "Name too short: min length is 3",
      maxlength: "Name is too long: max length is 200"
    },
    typeId: {
      required: "Please provide the type of the actor"
    }
  },
  submitHandler: function(actorFormMetadata) {
    actorFormMetadata.submit();
  },
});
var actorFormNames = $('#timaat-actordatasets-actor-actornames-form');
var actorFormNamesValidator = $('#timaat-actordatasets-actor-actornames-form').validate({
  rules: {
    actorName: {
      required: true,
      minlength: 3,
      maxlength: 200,
    }
  },
  messages: {
    actorName: {
      required: "Enter a name (min length: 3)",
      minlength: "Name too short: min length is 3",
      maxlength: "Name is too long: max length is 200"
    }
  },
  submitHandler: function(actorFormNames) {
    actorFormNames.submit();
  },
});
var actorFormAddresses = $('#timaat-actordatasets-actor-addresses-form');
var actorFormAddressesValidator = $('#timaat-actordatasets-actor-addresses-form').validate({
  rules: {
    streetNumber: {
      maxlength: 10,
    },
    streetAddition: {
      maxlength: 50,
    },
    postalCode: {
      maxlength: 8,
    },
    postOfficeBox: {
      maxlength: 10,
    },
    addressTypeId: {
      required: true,
    }
  },
  messages: {
    streetNumber: {
      maxlength: "Street number is too long: max length is 10"
    },
    streetAddition: {
      maxlength: "Street addtition is too long: max length is 50"
    },
    postalCode: {
      maxlength: "Postal code is too long: max length is 8"
    },
    postOfficeBox: {
      maxlength: "Post office box is too long: max length is 10"
    },
    addressTypeId: {
      required: "Select an address type"
    }
  },
  submitHandler: function(actorFormAddresses) {
    actorFormAddresses.submit();
  },
});
var actorFormEmailAddresses = $('#timaat-actordatasets-actor-emailaddresses-form');
var actorFormEmailAddressesValidator = $('#timaat-actordatasets-actor-emailaddresses-form').validate({
  rules: {
    email: {
      email: true
    },
    emailAddressTypeId: {
      required: true,
    }
  },
  messages: {
    email: {
      email: "Enter a valid email"
    },
    emailAddressTypeId: {
      required: "Select an email address type"
    }
  },
  submitHandler: function(actorFormEmailAddresses) {
    actorFormEmailAddresses.submit();
  },
});
var actorFormPhoneNumbers = $('#timaat-actordatasets-actor-phonenumbers-form');
var actorFormPhoneNumbersValidator = $('#timaat-actordatasets-actor-phonenumbers-form').validate({
  rules: {
    phoneNumberTypeId: {
      required: true
    }
  },
  messages: {
    phoneNumberTypeId: {
      required: "Select an email address type"
    }
  },
  submitHandler: function(actorFormPhoneNumbers) {
    actorFormPhoneNumbers.submit();
  },
});
var personFormMemberOfCollectives = $('#timaat-actordatasets-person-memberofcollective-form');
var personFormMemberOfCollectivesValidator = $('#timaat-actordatasets-person-memberofcollective-form').validate({
  rules: {
    collectiveId: {
      required: true
    }
  },
  messages: {
    collectiveId: {
      required: "Select a collective"
    }
  },
  submitHandler: function(personFormMemberOfCollectives) {
    personFormMemberOfCollectives.submit();
  },
});
var roleOrRoleGroupFormMetadata = $('#timaat-rolelists-metadata-form');
var roleOrRoleGroupFormMetadataValidator = $('#timaat-rolelists-metadata-form').validate({
  rules: {
    name: {
      required: true,
      minlength: 3,
      maxlength: 200
    }    
  },
  messages: {
    name: {
      required: "Enter a name (min length: 3)",
      minlength: "Name too short: min length is 3",
      maxlength: "Name is too long: max length is 200"
    }
  },
  submitHandler: function(roleOrRoleGroupFormMetadata) {
    roleOrRoleGroupFormMetadata.submit();
  },
});
var categoryOrCategorySetFormMetadata = $('#timaat-categorylists-metadata-form');
var categoryOrCategorySetFormMetadataValidator = $('#timaat-categorylists-metadata-form').validate({
  rules: {
    name: {
      required: true,
      minlength: 3,
      maxlength: 200,
    }    
  },
  messages: {
    name: {
      required: "Enter a name (min length: 3)",
      minlength: "Name too short: min length is 3",
      maxlength: "Name is too long: max length is 200",
    }
  },
  submitHandler: function(categoryOrCategorySetFormMetadata) {
    categoryOrCategorySetFormMetadata.submit();
  },
});
var languageFormMetadata = $('#timaat-languagelists-metadata-form');
var languageFormMetadataValidator = $('#timaat-languagelists-metadata-form').validate({
  rules: {
    name: {
      required: true,
      minlength: 3,
      maxlength: 200
    },
    code: {
      required: true,
      minlength: 2,
      maxlength: 10
    }
  },
  messages: {
    name: {
      required: "Enter a name (min length: 3)",
      minlength: "Name too short: min length is 3",
      maxlength: "Name is too long: max length is 200"
    },
    name: {
      required: "Enter the language code (length: 2)",
      minlength: "Code too short: min length is 2",
      maxlength: "Code is too long: max length is 10"
    }
  },
  submitHandler: function(languageFormMetadata) {
    languageFormMetadata.submit();
  },
});


function allocateArray(strOrArr) {
  var arr = strOrArr instanceof Uint8Array || strOrArr instanceof Array ? strOrArr : Module.intArrayFromString(strOrArr);
  return Module.allocate(arr, 'i8', Module.ALLOC_NORMAL);
}



console.log("TIMAAT::HTML Scripts loaded");