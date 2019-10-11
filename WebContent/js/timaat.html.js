      $('#timaat-login-modal').on('shown.bs.modal', function() {
        $('#timaat-login-user').focus();
      });

      var mediumForm = $("#timaat-mediadatasets-medium-form");
      var mediumFormValidator = $("#timaat-mediadatasets-medium-form").validate({
        rules: {
          primaryTitle: {
            required: true,
            minlength: 3,
          },
          primaryTitleLanguageId: {
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
          // }
        },
        messages: {
          primaryTitle: {
            required: "Enter a title (min length: 3)",
            minlength: "Title too short: min length is 3"
          },
          primaryTitleLanguageId: {
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
          // }
        },
        submitHandler: function(mediumForm) {
          mediumForm.submit();
        },
      });
      var audioForm = $("#timaat-mediadatasets-audio-form");
      var audioFormValidator = $("#timaat-mediadatasets-audio-form").validate({
        rules: {
          primaryTitle: {
            required: true,
            minlength: 3,
          },
          primaryTitleLanguageId: {
            required: true,
          },
          // releaseDate: {
          //   dateISO: true,
          // },
          // sourceLastAccessed: {
          //   dateISO: true,
          // }
        },
        messages: {
          primaryTitle: {
            required: "Enter a title (min length: 3)",
            minlength: "Title too short: min length is 3"
          },
          primaryTitleLanguageId: {
            required: "Please provide the title's language"
          },
          // releaseDate: {
          //   dateISO: "Please provide a valid date"
          // },
          // sourceLastAccessed: {
          //   dateISO: "Please provide a valid date"
          // }
        },
        submitHandler: function(audioForm) {
          audioForm.submit();
        },
      });
      var documentForm = $("#timaat-mediadatasets-document-form");
      var documentFormValidator = $("#timaat-mediadatasets-document-form").validate({
        rules: {
          primaryTitle: {
            required: true,
            minlength: 3,
          },
          primaryTitleLanguageId: {
            required: true,
          },
          // releaseDate: {
          //   dateISO: true,
          // },
          // sourceLastAccessed: {
          //   dateISO: true,
          // }
        },
        messages: {
          primaryTitle: {
            required: "Enter a title (min length: 3)",
            minlength: "Title too short: min length is 3"
          },
          primaryTitleLanguageId: {
            required: "Please provide the title's language"
          },
          // releaseDate: {
          //   dateISO: "Please provide a valid date"
          // },
          // sourceLastAccessed: {
          //   dateISO: "Please provide a valid date"
          // }
        },
        submitHandler: function(documentForm) {
          documentForm.submit();
        },
      });
      var imageForm = $("#timaat-mediadatasets-image-form");
      var imageFormValidator = $("#timaat-mediadatasets-image-form").validate({
        rules: {
          primaryTitle: {
            required: true,
            minlength: 3,
          },
          primaryTitleLanguageId: {
            required: true,
          },
          // releaseDate: {
          //   dateISO: true,
          // },
          // sourceLastAccessed: {
          //   dateISO: true,
          // }
        },
        messages: {
          primaryTitle: {
            required: "Enter a title (min length: 3)",
            minlength: "Title too short: min length is 3"
          },
          primaryTitleLanguageId: {
            required: "Please provide the title's language"
          },
          // releaseDate: {
          //   dateISO: "Please provide a valid date"
          // },
          // sourceLastAccessed: {
          //   dateISO: "Please provide a valid date"
          // }
        },
        submitHandler: function(imageForm) {
          imageForm.submit();
        },
      });
      var softwareForm = $("#timaat-mediadatasets-software-form");
      var softwareFormValidator = $("#timaat-mediadatasets-software-form").validate({
        rules: {
          primaryTitle: {
            required: true,
            minlength: 3,
          },
          primaryTitleLanguageId: {
            required: true,
          },
          // releaseDate: {
          //   dateISO: true,
          // },
          // sourceLastAccessed: {
          //   dateISO: true,
          // }
        },
        messages: {
          primaryTitle: {
            required: "Enter a title (min length: 3)",
            minlength: "Title too short: min length is 3"
          },
          primaryTitleLanguageId: {
            required: "Please provide the title's language"
          },
          // releaseDate: {
          //   dateISO: "Please provide a valid date"
          // },
          // sourceLastAccessed: {
          //   dateISO: "Please provide a valid date"
          // }
        },
        submitHandler: function(softwareForm) {
          softwareForm.submit();
        },
      });
      var textForm = $("#timaat-mediadatasets-text-form");
      var textFormValidator = $("#timaat-mediadatasets-text-form").validate({
        rules: {
          primaryTitle: {
            required: true,
            minlength: 3,
          },
          primaryTitleLanguageId: {
            required: true,
          },
          // releaseDate: {
          //   dateISO: true,
          // },
          // sourceLastAccessed: {
          //   dateISO: true,
          // }
        },
        messages: {
          primaryTitle: {
            required: "Enter a title (min length: 3)",
            minlength: "Title too short: min length is 3"
          },
          primaryTitleLanguageId: {
            required: "Please provide the title's language"
          },
          // releaseDate: {
          //   dateISO: "Please provide a valid date"
          // },
          // sourceLastAccessed: {
          //   dateISO: "Please provide a valid date"
          // }
        },
        submitHandler: function(textForm) {
          textForm.submit();
        },
      });
      var videoForm = $("#timaat-mediadatasets-video-form");
      var videoFormValidator = $("#timaat-mediadatasets-video-form").validate({
        rules: {
          primaryTitle: {
            required: true,
            minlength: 3,
          },
          primaryTitleLanguageId: {
            required: true,
          },
          // releaseDate: {
          //   dateISO: true,
          // },
          // sourceLastAccessed: {
          //   dateISO: true,
          // }
        },
        messages: {
          primaryTitle: {
            required: "Enter a title (min length: 3)",
            minlength: "Title too short: min length is 3"
          },
          primaryTitleLanguageId: {
            required: "Please provide the title's language"
          },
          // releaseDate: {
          //   dateISO: "Please provide a valid date"
          // },
          // sourceLastAccessed: {
          //   dateISO: "Please provide a valid date"
          // }
        },
        submitHandler: function(videoForm) {
          videoForm.submit();
        },
      });
      var videogameForm = $("#timaat-mediadatasets-videogame-form");
      var videogameFormValidator = $("#timaat-mediadatasets-videogame-form").validate({
        rules: {
          primaryTitle: {
            required: true,
            minlength: 3,
          },
          primaryTitleLanguageId: {
            required: true,
          },
          // releaseDate: {
          //   dateISO: true,
          // },
          // sourceLastAccessed: {
          //   dateISO: true,
          // }
        },
        messages: {
          primaryTitle: {
            required: "Enter a title (min length: 3)",
            minlength: "Title too short: min length is 3"
          },
          primaryTitleLanguageId: {
            required: "Please provide the title's language"
          },
          // releaseDate: {
          //   dateISO: "Please provide a valid date"
          // },
          // sourceLastAccessed: {
          //   dateISO: "Please provide a valid date"
          // }
        },
        submitHandler: function(videogameForm) {
          videogameForm.submit();
        },
      });
      
      function allocateArray(strOrArr) {
    		var arr = strOrArr instanceof Uint8Array || strOrArr instanceof Array ? strOrArr : Module.intArrayFromString(strOrArr);
    		return Module.allocate(arr, 'i8', Module.ALLOC_NORMAL);
    	}



      console.log("TIMAAT::HTML Scripts loaded");