//  <!-- focus username field in login mask -->
$('#timaat-login-modal').on('shown.bs.modal', function() {
  $('#timaat-login-user').focus();
});

// <!-- client side form validation -->
var mediumFormMetadata = $('#medium-metadata-form');

jQuery.validator.addMethod("greaterThanStart", function (value, element, params) {
  return this.optional(element) || new Date(value) >= new Date($(params).val());
},'Must be greater than recording start date.');

var mediumFormMetadataValidator = $('#medium-metadata-form').validate({
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
    recordingEndDate: {
      required: function(element) {return ($("#timaat-mediadatasets-metadata-medium-recordingenddate").val()!="");},
      greaterThanStart: '#timaat-mediadatasets-metadata-medium-recordingstartdate'
    },
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
    recordingEndDate: {
      greaterThan: "Recording end date has to be later than recording start date."
    },
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
var mediumFormTitles = $('#medium-titles-form');
var mediumFormTitlesValidator = $('#medium-titles-form').validate({
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
    title: {
      required: "Enter a title (min length: 3)",
      minlength: "Title too short: min length is 3",
      maxlength: "Title is too long: max length is 200"
    },
    titleLanguageId: {
      required: "Please select a language."
    }
  },
  submitHandler: function(mediumFormTitles) {
    mediumFormTitles.submit();
  },
});
var mediumFormLanguageTracks = $('#medium-languagetracks-form');
var mediumFormLanguageTracksValidator = $('#medium-languagetracks-form').validate({
  rules: {
    languageTrackTypeId: {
      required: true,
    },
    languageTrackLanguageId: {
      required: true,
    },
  },
  messages: {
    languageTrackTypeId: {
      required: 'Please select a track.'
    },
    languageTrackLanguageId: {
      required: 'Please select a language.'
    }
  },
  submitHandler: function(mediumFormLanguageTracks) {
    mediumFormLanguageTracks.submit();
  },
});
var mediumFormActorRoles = $('#medium-actorwithroles-form');
var mediumFormActorRolesValidator = $('#medium-actorwithroles-form').validate({
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
});
var mediumCollectionFormMetadata = $('#mediumcollection-metadata-form');
var mediumCollectionFormMetadataValidator = $('#mediumcollection-metadata-form').validate({
  rules: {
    title: {
      required: true,
      minlength: 3,
      maxlength: 200
    },
    typeId: {
      required: true,
    },
    ended: {
      required: function(element) {return ($("#timaat-mediumcollectiondatasets-metadata-series-ended").val()!="");},
      greaterThanStart: '#timaat-mediumcollectiondatasets-metadata-series-started'
    },
  },
  messages: {
    title: {
      required: "Enter a title (min length: 3)",
      minlength: "Title too short: min length is 3",
      maxlength: "Title is too long: max length is 200"
    },
    typeId: {
      required: "Please provide the type of the medium collection"
    },
    ended: {
      greaterThan: "End date has to be later than start date."
    },
  },
  submitHandler: function(mediumCollectionFormMetadata) {
    mediumCollectionFormMetadata.submit();
  },
});
var actorFormMetadata = $('#actor-metadata-form');
var actorFormMetadataValidator = $('#actor-metadata-form').validate({
  rules: {
    displayName: {
      required: true,
      minlength: 3,
      maxlength: 200
    },
    typeId: {
      required: true
    },
    sexId: {
      required: true
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
    },
    sexId: {
      required: "Please enter a sex for this person"
    }
  },
  submitHandler: function(actorFormMetadata) {
    actorFormMetadata.submit();
  },
});
var actorFormNames = $('#actor-names-form');
var actorFormNamesValidator = $('#actor-names-form').validate({
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
var actorFormAddresses = $('#actor-addresses-form');
var actorFormAddressesValidator = $('#actor-addresses-form').validate({
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
var actorFormEmailAddresses = $('#actor-emailaddresses-form');
var actorFormEmailAddressesValidator = $('#actor-emailaddresses-form').validate({
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
var actorFormPhoneNumbers = $('#actor-phonenumbers-form');
var actorFormPhoneNumbersValidator = $('#actor-phonenumbers-form').validate({
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
var actorFormMemberOfCollectives = $('#actor-memberofcollectives-form');
var actorFormMemberOfCollectivesValidator = $('#actor-memberofcollectives-form').validate({
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
  submitHandler: function(actorFormMemberOfCollectives) {
    actorFormMemberOfCollectives.submit();
  },
});
var eventFormMetadata = $('#event-metadata-form');
var eventFormMetadataValidator = $('#event-metadata-form').validate({
  rules: {
    name: {
      required: true,
      minlength: 3,
      maxlength: 255
    },
    description: {
      maxlength: 4096,
    }     
  },
  messages: {
    name: {
      required: "Enter a name (min length: 3)",
      minlength: "Name too short: min length is 3",
      maxlength: "Name is too long: max length is 255"
    },
    description: {
      maxlength: "Text is too long: max length is 4096"
    }
  },
  submitHandler: function(eventFormMetadata) {
    eventFormMetadata.submit();
  },
});
var roleFormMetadata = $('#role-metadata-form');
var roleFormMetadataValidator = $('#role-metadata-form').validate({
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
  submitHandler: function(roleFormMetadata) {
    roleFormMetadata.submit();
  },
});
var roleGroupFormMetadata = $('#rolegroup-metadata-form');
var roleGroupFormMetadataValidator = $('#rolegroup-metadata-form').validate({
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
  submitHandler: function(roleGroupFormMetadata) {
    roleGroupFormMetadata.submit();
  },
});
var categoryOrCategorySetFormMetadata = $('#category-metadata-form');
var categoryOrCategorySetFormMetadataValidator = $('#category-metadata-form').validate({
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
var languageFormMetadata = $('#language-metadata-form');
var languageFormMetadataValidator = $('#language-metadata-form').validate({
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
    code: {
      required: "Enter the language code (length: 2)",
      minlength: "Code too short: min length is 2",
      maxlength: "Code is too long: max length is 10"
    }
  },
  submitHandler: function(languageFormMetadata) {
    languageFormMetadata.submit();
  },
});
var analysisMethodModal = $('#timaat-videoplayer-analysis-add');
var analysisMethodModalValidator = $('#timaat-videoplayer-analysis-add').validate({
  rules: {
    analysisMethodId: {
      required: true,
    },
    question: {
      required: true,
    },
    accent: {
      maxlength: 255,
    },
    intonation: {
      maxlength: 255,
    },
    volume: {
      maxlength: 255,
    },
    tempo: {
      maxlength: 255,
    },
    pauses: {
      maxlength: 255,
    },
    timbre: {
      maxlength: 255,
    },
    overdubbing: {
      maxlength: 255,
    },
    reverb: {
      maxlength: 255,
    },
    delay: {
      maxlength: 255,
    },
    panning: {
      maxlength: 255,
    },
    bass: {
      maxlength: 255,
    },
    treble: {
      maxlength: 255,
    },
  },
  messages: {
    analysisMethodId: {
      required: "Please select an option.",
    },
    question: {
      required: "Please answer the question.",
    },
    accent: {
      maxlength: "Text is too long: max length is 255",
    },
    intonation: {
      maxlength: "Text is too long: max length is 255",
    },
    volume: {
      maxlength: "Text is too long: max length is 255",
    },
    tempo: {
      maxlength: "Text is too long: max length is 255",
    },
    pauses: {
      maxlength: "Text is too long: max length is 255",
    },
    timbre: {
      maxlength: "Text is too long: max length is 255",
    },
    overdubbing: {
      maxlength: "Text is too long: max length is 255",
    },
    reverb: {
      maxlength: "Text is too long: max length is 255",
    },
    delay: {
      maxlength: "Text is too long: max length is 255",
    },
    panning: {
      maxlength: "Text is too long: max length is 255",
    },
    bass: {
      maxlength: "Text is too long: max length is 255",
    },
    treble: {
      maxlength: "Text is too long: max length is 255",
    },
  },
  submitHandler: function(analysisMethodModal) {
    analysisMethodModal.submit();
  },
});


function allocateArray(strOrArr) {
  var arr = strOrArr instanceof Uint8Array || strOrArr instanceof Array ? strOrArr : Module.intArrayFromString(strOrArr);
  return Module.allocate(arr, 'i8', Module.ALLOC_NORMAL);
}



console.info("TIMAAT::HTML Scripts loaded");