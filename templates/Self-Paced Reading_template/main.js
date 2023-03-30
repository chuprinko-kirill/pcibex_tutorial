PennController.ResetPrefix(null); // Shorten command names (keep this line here))

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// showProgressBar = false // uncomment if you like to remove the progressbar on slides

// First show instructions, then experiment trials, send results and show end screen
Sequence("instructions", "experiment", SendResults(), "end")

// This is run at the beginning of each trial
Header(
    // Declare global Var elements in which we will store the participant's demographic info
    newVar("AGE").global(),
    newVar("SEX").global() 
)
.log("age", getVar("AGE"))
.log("sex", getVar("SEX"))

// Instructions
newTrial("instructions",
    newHtml("form", "form.html")
    .print()
    ,
newButton("continue")
        .center()
        .print()
        .wait(getHtml("form").test.complete() // command inside the .wait() looks whether the obligatory fields of the form were completed
          .failure(getHtml("form").warn()) // raise an error if the form is not complete; errors' text is prescripted in the "Form.js" file; 'obligatory' class in the html makes errors to occur when not filled 
          )
    ,
    // we need some extra techniques to extract value into the code from the html
    // we call the variable declared in the Header and set its value with JQuery library instruments 
    // JQuery documentation https://api.jquery.com/category/selectors/
    // $ is a JQuery library functionality call
    // input means tag <input> in the html
    // [name=''] means that we search an <input> tag with such 'name' attribute in the html
    // watch a different type of quotes inside other quotes
    // .val() - part of JQuery to get the value of input
    getVar("AGE").set(v=>$("input[name='age']").val()), 
    // ':checked' is used for radio buttons, we specify that we need to extract the chosen button
    getVar("SEX").set(v=>$("input[name='sex']:checked").val())
)

// Experiment trials

Template("pcibex_test.csv", row =>
newTrial( "experiment",
    newButton("Start reading")
        .center().print("center at 50vw","middle at 50vh")
        .wait()
        .remove()
    ,
    newController("DashedSentence", {s : row.sentence}) // '.sentence' stands for the column name in the .csv
        .center().print("center at 50vw","middle at 50vh")
        .log()      // Make sure to log the participant's progress
        .wait()
        .remove()
    ,
    // Add comprehension question if there is one     
    newFunction("test_quest", () => row.question == "") // function introducing some logic depending on the content of the 'question' column
        .testNot.is() // do nothing if there is no question in the row
        .failure(
            // participants can answer by pressing the corresponding number keys
            newController("Question",
            {q: row.question, // contains question string
            as:[row.answer_correct, row.answer_wrong], // array of possible answers
            hasCorrect:true, //means that the first answer in "as" array is correct
            randomOrder:true}) // randomize answers order
            .center().print("center at 50vw","middle at 50vh")
            .log().wait().remove(),
            clear() // clear the slide after the question answered 
                )
    
    ,
    newButton("Next sentence please!") // participant moves to the next slide by pushing the button
        .center().print("center at 50vw","middle at 50vh")
        .wait()
    )
    .log("sentence_type",row.feature) // writing down some stimuli features will ease the data analysis
)

// Final screen
newTrial("end",
    newText("The experiment is over. Thank you for participating!<br>You can now close this page.")
        .center().print("center at 50vw","middle at 50vh")
    ,
    // Trick: stay on this trial forever (until tab is closed)
    newButton().wait()
)
.setOption("countsForProgressBar",false) // means that final screen is not included in the progressbar calculations