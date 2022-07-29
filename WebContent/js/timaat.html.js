//  <!-- focus username field in login mask -->
$('#loginModal').on('shown.bs.modal', function() {
  $('#logInUserName').focus();
});

// <!-- client side form validation -->

jQuery.validator.addMethod("greaterThanStart", function (value, element, params) {
  return this.optional(element) || new Date(value) >= new Date($(params).val());
},'Must be greater than recording start date.');

jQuery.validator.addMethod("equals", function (value, element, params) {
  return value == $(params).val();
},'The retyped password does not match your new password.');

jQuery.validator.addMethod("notEqualTo", function (value, element, params) {
  return value != $(params).val();
},'Username and display name cannot be identical.');

var changeUserPassword = $('#changeUserPassword');
var changeUserPasswordValidator = $('#changeUserPassword').validate({
  rules: {
    currentPassword: {
      required: true,
      maxlength: 255
    },
    newPassword: {
      required: true,
      minlength: 13,
      maxlength: 255
    },
    newPasswordConfirmed: {
      required: true,
      minlength: 13,
      maxlength: 255,
      equals: '#newPassword'
    },
  },
  messages: {
    currentPassword: {
      required: "Please enter your current password",
      maxlength: "The password cannot be longer than 255 characters. That's enough entropy. :)",
    },
    newPassword: {
      required: "Please enter a new password",
      minlength: "The password has to be at least 13 characters long.",
      maxlength: "The password cannot be longer than 255 characters. That's enough entropy. :)",
    },
    newPasswordConfirmed: {
      required: "Please confirm your new password",
      minlength: "The password has to be at least 13 characters long.",
      maxlength: "The password cannot be longer than 255 characters. That's enough entropy. :)",
      equals: "Your retyped password does not match your new password."
    },
  },
  submitHandler: function(changeUserPassword) {
    changeUserPassword.submit();
  }
});
var createNewAccountForm = $('#createNewAccountForm');
var createNewAccountFormValidator = $('#createNewAccountForm').validate({
  rules: {
    newAccountUsername: {
      required: true,
      minlength: 8,
      maxlength: 45,
    },
    newAccountDisplayName: {
      required: true,
      minlength: 5,
      maxlength: 45,
      notEqualTo: '#newAccountUsername'
    },
    newAccountPassword: {
      required: true,
      minlength: 13,
      maxlength: 255,
    },
  },
  messages: {
    newAccountUsername: {
      required: "Please enter a valid login name",
      minlength: "The login name has to be at least 8 characters long.",
      maxlength: "The login name cannot be longer than 45 characters.",
    },
    newAccountDisplayName: {
      required: "Please enter a new password",
      minlength: "The display name has to be at least 5 characters long.",
      maxlength: "The display name cannot be longer than 45 characters.",
      notEqualTo: "Username and display name cannot be identical.",
    },
    newAccountPassword: {
      required: "Please provide a temporary password",
      minlength: "The password has to be at least 13 characters long.",
      maxlength: "The password cannot be longer than 255 characters. That's enough entropy. :)",
    },
  },
  submitHandler: function(createNewAccountForm) {
    createNewAccountForm.submit();
  }
});
var mediumFormMetadata = $('#mediumFormMetadata');
var mediumFormMetadataValidator = $('#mediumFormMetadata').validate({
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
      required: function(element) {return ($("#mediumDatasetsMetadataMediumRecordingEndDate").val()!="");},
      greaterThanStart: '#mediumDatasetsMetadataMediumRecordingStartDate'
    },
    width: {
      number: true,
      max: 65535
    },
    height: {
      number: true,
      max: 65535
    },
    // bitDepth: {
    //   number: true,
    //   max: 65535
    // },
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
    // bitDepth: {
    //   number: "Please provide a valid number",
    //   max: "Please provide a value not greater 65535"
    // },
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
var mediumFormTitles = $('#mediumFormTitles');
var mediumFormTitlesValidator = $('#mediumFormTitles').validate({
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
var mediumFormLanguageTracks = $('#mediumFormLanguageTracks');
var mediumFormLanguageTracksValidator = $('#mediumFormLanguageTracks').validate({
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
var mediumFormActorRoles = $('#mediumFormActorWithRoles');
var mediumFormActorRolesValidator = $('#mediumFormActorWithRoles').validate({
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
var mediumCollectionFormMetadata = $('#mediumCollectionFormMetadata');
var mediumCollectionFormMetadataValidator = $('#mediumCollectionFormMetadata').validate({
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
      required: function(element) {return ($("#mediumCollectionDatasetsMetadataSeriesEnded").val()!="");},
      greaterThanStart: '#mediumCollectionDatasetsMetadataSeriesStarted'
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
var actorFormMetadata = $('#actorFormMetadata');
var actorFormMetadataValidator = $('#actorFormMetadata').validate({
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
var actorFormNames = $('#actorFormNames');
var actorFormNamesValidator = $('#actorFormNames').validate({
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
var actorFormAddresses = $('#actorFormAddresses');
var actorFormAddressesValidator = $('#actorFormAddresses').validate({
  rules: {
    city: {
      maxlength: 100,
    },
    street: {
      maxlength: 100,
    },
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
    city: {
      maxlength: "City name is too long: max length is 100"
    },
    street: {
      maxlength: "Street name is too long: max length is 100"
    },
    streetNumber: {
      maxlength: "Street number is too long: max length is 10"
    },
    streetAddition: {
      maxlength: "Street addition is too long: max length is 50"
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
var actorFormEmailAddresses = $('#actorFormEmailAddresses');
var actorFormEmailAddressesValidator = $('#actorFormEmailAddresses').validate({
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
var actorFormPhoneNumbers = $('#actorFormPhoneNumbers');
var actorFormPhoneNumbersValidator = $('#actorFormPhoneNumbers').validate({
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
var actorFormMemberOfCollectives = $('#actorFormMemberOfCollectives');
var actorFormMemberOfCollectivesValidator = $('#actorFormMemberOfCollectives').validate({
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
var eventFormMetadata = $('#eventFormMetadata');
var eventFormMetadataValidator = $('#eventFormMetadata').validate({
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
var roleFormMetadata = $('#roleFormMetadata');
var roleFormMetadataValidator = $('#roleFormMetadata').validate({
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
var roleGroupFormMetadata = $('#roleGroupFormMetadata');
var roleGroupFormMetadataValidator = $('#roleGroupFormMetadata').validate({
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
var categoryOrCategorySetFormMetadata = $('#categoryFormMetadata');
var categoryOrCategorySetFormMetadataValidator = $('#categoryFormMetadata').validate({
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
var languageFormMetadata = $('#languageFormMetadata');
var languageFormMetadataValidator = $('#languageFormMetadata').validate({
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
var analysisMethodModal = $('#analysisAddModal');
var analysisMethodModalValidator = $('#analysisAddModal').validate({
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
var musicFormMetadata = $('#musicFormMetadata');
var musicFormMetadataValidator = $('#musicFormMetadata').validate({
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
    tempo: {
      number: true,
      maxlength: 4
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
      required: "Please provide the type of the music"
    },
    tempo: {
      number: "Please provide a valid number",
      maxLength: "Number is too large"
    }
  },
  submitHandler: function(musicFormMetadata) {
    musicFormMetadata.submit();
  },
});
var musicFormTitles = $('#musicFormTitles');
var musicFormTitlesValidator = $('#musicFormTitles').validate({
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
  submitHandler: function(musicFormTitles) {
    musicFormTitles.submit();
  },
});
var musicFormActorRoles = $('#musicFormActorWithRoles');
var musicFormActorRolesValidator = $('#musicFormActorWithRoles').validate({
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
  submitHandler: function(musicFormLanguageTracks) {
    musicFormLanguageTracks.submit();
  },
});
var musicFormMediumHasMusicList = $('#musicFormMediumHasMusicList');
var musicFormMediumHasMusicListValidator = $('#musicFormMediumHasMusicList').validate({
  ignore: [],
  rules: {
    mediumId: {
      required: true,
    },
  },
  messages: {
    mediumId: {
      required: 'Please select a medium.'
    },
  },
  submitHandler: function(musicFormLanguageTracks) {
    musicFormLanguageTracks.submit();
  },
});


function allocateArray(strOrArr) {
  var arr = strOrArr instanceof Uint8Array || strOrArr instanceof Array ? strOrArr : Module.intArrayFromString(strOrArr);
  return Module.allocate(arr, 'i8', Module.ALLOC_NORMAL);
}



console.info("TIMAAT::HTML Scripts loaded");