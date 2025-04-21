import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

// Middleware to parse URL-encoded data (optional)
app.use(bodyParser.urlencoded({ extended: true }));

//1. GET a random joke
app.get("/random", async (req, res) => {
  // debugging
  console.log("req.params = ", req.params);
  // Retrieve a random entry from the 'jokes' array
  let joke = await jokes[Math.floor(Math.random() * jokes.length)];
  console.log("random joke = ", joke);
  // return the randomly generated joke to the client (response)
  res.send(joke);
});

//2. GET a specific joke (http://localhost:3000/jokes/2)
app.get("/jokes/:id", async (req, res) => {
  // retrieve the id from the query parameters
  let id = req.params.id;
  console.log(`typeof(${id}) = `, typeof id);
  id = Number(id);
  console.log(`typeof(${id}) = `, typeof id);
  if (Number.isNaN(id)) {
    // id is not a number, throw an error
    res.send({
      error: `${id} is not a number. Please enter a numeric value for the id.`,
    });
  } else {
    let jokeById;
    // Normally, I'd traverse the data using a loop but since I see that
    // a joke with id = id is the idth - 1 entry in the jokes array, I'm just
    // going to retrieve that entry in the array
    // jokeById = await jokes[id - 1];

    for (let i = 0; i < jokes.length; i++) {
      if (jokes[i].id === id) {
        jokeById = jokes[i];
        break;
      }
    }

    console.log("jokeById = ", jokeById);

    // check to see if a joke with that id actually exists
    if (typeof jokeById === "undefined") {
      res.send({
        error: `Joke with id ${id} does not exist.`,
      });
    } else {
      // return the joke with id = id to the client (response)
      res.send(jokeById);
    }
  }
});

//3. GET a jokes by filtering on the joke type ('http://localhost:3000/filter?type=Puns')
app.get("/filter", async (req, res) => {
  // debugging
  console.log("req.query = ", req.query);

  if (Object.keys(req.query).length === 0) {
    // for some reason, there were no parameters in the request
    res.send({
      error: `/filter: No parameters were sent in the request`,
    });
  }
  // check to see if 'type' is one of the query parameters
  else if (req.query.hasOwnProperty("type")) {
    // retrieve the value for 'type' from the request
    const type = req.query.type;
    // array that will be sent in the response
    let jokesByType = [];
    for (let i = 0; i < jokes.length; i++) {
      if (jokes[i].jokeType.toLowerCase() === type.toLowerCase()) {
        // add the joke that has that type to the output array
        jokesByType.push(jokes[i]);
      }
    }
    // return array of jokes with jokeType = type to the client (response)
    if (jokesByType.length === 0) {
      res.send({
        jokes: jokesByType,
        message: `There are no jokes that are of type \'${type}.\'`,
      });
    } else {
      res.send(jokesByType);
    }
  } else {
    res.send({
      error: `/filter: Please add \'type\' as a query parameter.`,
    });
  }
});

//4. POST a new joke ('http://localhost:3000/jokes', body: {jokeText, jokeType})
app.post("/jokes", async (req, res) => {
  // debugging purposes
  let body = req.body;
  console.log("request's body = ", body);
  if (Object.keys(req.body).length === 0) {
    // for some reason, a joke was not in the body of the request
    res.send({
      error: `/jokes: add a joke and it's type`,
    });
  }
  // check to see if 'type' & 'text' are in the body of the request
  else if (req.body.hasOwnProperty("text") && req.body.hasOwnProperty("type")) {
    if (
      req.body.type.trim().length === 0 ||
      req.body.text.trim().length === 0
    ) {
      // the text or the type of the joke is an empty string
      res.send({
        error: `/jokes: Please add a \'type\' & some \'text\' for your joke.`,
      });
    } else {
      // new joke to be added
      let newJoke = {
        // in a real application, the database would randomly generate the id
        id: jokes.length,
        jokeText: req.body.text,
        jokeType: req.body.type,
      };
      // In a real application, the newJoke would be sent to the database but this "applictaion"
      // has no database so I'll "append" it to the jokes array.
      jokes.push(newJoke);
      // return the newly created joke to the client (response)
      res.send(newJoke);
    }
  } else {
    res.send({
      error: `/jokes: Please add a \'type\' & some \'text\' for your joke.`,
    });
  }
});

//5. PUT a joke ('http://localhost:3000/jokes/:id')
app.put("/jokes/:id", async (req, res) => {
  // replaces the joke with the specified id
  // retrieve the id from the query parameters
  let id = req.params.id;
  console.log(`typeof(${id}) = `, typeof id);
  id = Number(id);
  console.log(`typeof(${id}) = `, typeof id);

  if (Number.isNaN(id)) {
    // id is not a number, throw an error
    res.send({
      error: `${id} is not a number. Please enter a numeric value for the id.`,
    });
  } else {
    if (Object.keys(req.body).length === 0) {
      // for some reason, the type of joke and its text were not in the body of the request
      res.send({
        error: `/jokes: add a joke and it's type`,
      });
    } // check to see if 'type' & 'text' are in the body of the request
    else if (
      req.body.hasOwnProperty("text") &&
      req.body.hasOwnProperty("type")
    ) {
      // debugging purposes
      let body = req.body;
      console.log("request's body = ", body);

      if (
        req.body.type.trim().length === 0 ||
        req.body.text.trim().length === 0
      ) {
        // the text or the type of the joke is an empty string
        res.send({
          error: `PUT: /jokes/${id}: Please add a \'type\' & some \'text\' for the joke.`,
        });
      } else {
        let jokeById;
        // Normally, I'd traverse the data using a loop but since I see that
        // a joke with id = id is the idth - 1 entry in the jokes array, I'm just
        // going to retrieve that entry in the array
        // jokeById = await jokes[id - 1];

        for (let i = 0; i < jokes.length; i++) {
          if (jokes[i].id === id) {
            jokeById = jokes[i];
            break;
          }
        }
        console.log("PUT: jokeById = ", jokeById);

        // check to see if a joke with that id actually exists
        if (typeof jokeById === "undefined") {
          res.send({
            error: `Can't replace joke with id ${id} because it does not exist.`,
          });
        } else {
          // In a real application, the jokeById's new fields would be sent to the database but this "applictaion"
          // has no database so I'll just "modify" all the fields in jokeById.

          // replace jokeById's text and type
          jokeById.jokeText = req.body.text;
          jokeById.jokeType = req.body.type;
          // return the joke with id = id to the client (response)
          res.send(jokeById);
        }
      }
    }
  }
});

//6. PATCH a joke ('http://localhost:3000/jokes/:id')
app.patch("/jokes/:id", async (req, res) => {
  // updates the joke with the specified id
  // retrieve the id from the query parameters
  let id = req.params.id;
  console.log(`typeof(${id}) = `, typeof id);
  id = Number(id);
  console.log(`typeof(${id}) = `, typeof id);

  if (Number.isNaN(id)) {
    // id is not a number, throw an error
    res.send({
      error: `${id} is not a number. Please enter a numeric value for the id.`,
    });
  } else {
    if (Object.keys(req.body).length === 0) {
      // for some reason, the type of joke and its text were not in the body of the request
      res.send({
        error: `/jokes: add a joke and it's type`,
      });
    } // check to see if 'type' OR 'text' are in the body of the request
    else if (
      req.body.hasOwnProperty("text") ||
      req.body.hasOwnProperty("type")
    ) {
      // debugging purposes
      let body = req.body;
      console.log("request's body = ", body);

      if (
        (typeof req.body.type !== "string" ||
          req.body.type.trim().length === 0) &&
        (typeof req.body.text !== "string" || req.body.text.trim().length === 0)
      ) {
        // the text AND the type of the joke is an empty string
        res.send({
          error: `PATCH: /jokes/${id}: Please add a \'type\' OR some \'text\' for the joke with id = ${id} so it can be updated.`,
        });
      } else {
        let jokeById;
        // Normally, I'd traverse the data using a loop but since I see that
        // a joke with id = id is the idth - 1 entry in the jokes array, I'm just
        // going to retrieve that entry in the array
        // jokeById = await jokes[id - 1];

        for (let i = 0; i < jokes.length; i++) {
          if (jokes[i].id === id) {
            jokeById = jokes[i];
            break;
          }
        }

        console.log("PATCH: jokeById = ", jokeById);

        // check to see if a joke with that id actually exists
        if (typeof jokeById === "undefined") {
          res.send({
            error: `Can't replace joke with id ${id} because it does not exist.`,
          });
        } else {
          // In a real application, the jokeById's new fields would be sent to the database but this "applictaion"
          // has no database so I'll just "modify" all the fields in jokeById.

          // update jokeById's text and type

          // Edge cases for scenarios where a user updates the text OR the type,
          // only the type OR the text fields exists.
          // check to see if 'text' field exists
          if (typeof req.body.text !== "undefined") {
            // only update the text if it's not an empty string
            if (req.body.text.trim().length !== 0) {
              jokeById.jokeText = req.body.text;
            }
          }
          // check to see if type field exists
          if (typeof req.body.type !== "undefined") {
            // update the type on if it's not an empty string
            if (req.body.type.trim().length !== 0) {
              jokeById.jokeType = req.body.type;
            }
          }

          // return the joke with id = id to the client (response)
          res.send(jokeById);
        }
      }
    }
  }
});

//7. DELETE Specific joke ('http://localhost:3000/jokes/:id')
app.delete("/jokes/:id", async (req, res) => {
  // deletes the joke with the specified id
  // retrieve the id from the query parameters
  let id = req.params.id;
  console.log(`typeof(${id}) = `, typeof id);
  id = Number(id);
  console.log(`typeof(${id}) = `, typeof id);

  if (Number.isNaN(id)) {
    // id is not a number, throw an error
    res.send({
      error: `${id} is not a number. Please enter a numeric value for the id.`,
    });
  }
});

//8. DELETE All jokes

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});

var jokes = [
  {
    id: 1,
    jokeText:
      "Why don't scientists trust atoms? Because they make up everything.",
    jokeType: "Science",
  },
  {
    id: 2,
    jokeText:
      "Why did the scarecrow win an award? Because he was outstanding in his field.",
    jokeType: "Puns",
  },
  {
    id: 3,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 4,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 5,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 6,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 7,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 8,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 9,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 10,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 11,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 12,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 13,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 14,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 15,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 16,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 17,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 18,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 19,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 20,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 21,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 22,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 23,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 24,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 25,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 26,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 27,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 28,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 29,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 30,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 31,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 32,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 33,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 34,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 35,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 36,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 37,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 38,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 39,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 40,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 41,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 42,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 43,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 44,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 45,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 46,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 47,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 48,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 49,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 50,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 51,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 52,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 53,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 54,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 55,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 56,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 57,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 58,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 59,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 60,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 61,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 62,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 63,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 64,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 65,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 66,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 67,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 68,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 69,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 70,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 71,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 72,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 73,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 74,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 75,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 76,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 77,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 78,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 79,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 80,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 81,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 82,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 83,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 84,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 85,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 86,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 87,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 88,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 89,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 90,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 91,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 92,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 93,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 94,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 95,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 96,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 97,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 98,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 99,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 100,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
];
