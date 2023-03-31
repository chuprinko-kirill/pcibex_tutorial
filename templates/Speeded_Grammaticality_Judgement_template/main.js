PennController.ResetPrefix()
// DebugOff()

// Declare the sequence of trials
Sequence( "instructions" , "practice" , randomize("test") , SendResults() , "final" )
showProgressBar = false // removes progressbar

Header(
    // Declare global Var elements in which we will store the participant's demographic info
    newVar("AGE").global(),
    newVar("SEX").global() 
)
.log("age", getVar("AGE"))
.log("sex", getVar("SEX"))

// Screen collecting participants' personal information and consent
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

// Training session
newTrial("practice" ,
    // Text element at the top of the page to signal this is a practice trial
    newText("practice").color("blue").print("center at 50vw","top at 1em")
    ,
    newController("Separator",{
     transfer: 1200, // time for break between tasks
     normalMessage: "***",
     errorMessage: "Time to answer is out!" // red colored message when there was no answer
    }).center().print("center at 50vw","middle at 50vh").wait().remove()
    ,
    newController("AcceptabilityJudgment",{
            s: "", // deliberately left blank; tehcnical decisions force us to put some string even when we don't need it
            q: "This is the practice sentence!", // NB: you should put your stimuli in q(uestion) parameter for friendlier data sheets afterwards
            as: ['1','2','3','4','5'], // you can put more numbers on a scale; they should be in quotes, we need them as string type
            presentAsScale: true, // presents answer options horizontally 
            autoFirstChar : true, // allows participants to press corresponding number buttons to answer
            timeout: 5000 // ms for answer
            
        }).center().print("center at 50vw","middle at 50vh")
        .log()
        .wait()
        .remove()
)

// Executing experiment from list.csv table, where participants are divided into two groups (A vs B)
Template( "list.csv" , 
    row => newTrial( "test" ,  
        
        newController("Separator",{
            transfer: 1200, // time for break
            normalMessage: "***",
            errorMessage: "Time to answer is out!"
        }).center().print("center at 50vw","middle at 50vh").wait().remove()
        ,
        
        newController("AcceptabilityJudgment",{
            s: "", // deliberately left blank; tehcnical decisions force us to put some string even when we don't need it
            q: row.target,// NB: you should put your stimuli in q(uestion) parameter for friendlier data sheet afterwards
            as: ['1','2','3','4','5'], // you can put more numbers on a scale; they should be in quotes, we need them as string type
            presentAsScale: true,
            autoFirstChar : true, // allows participants to press corresponding number buttons to answer
            timeout: 5000 //  ms for answer
        }).center().print("center at 50vw","middle at 50vh")
        .log()
        .wait()
        .remove()
        // End of trial, move to next one
    )
    .log( "Group"     , row.group)      // Append group (A vs B) to each result line
    .log( "Condition" , row.condition)  // Append condition
)


// A simple final screen
newTrial ( "final" ,
    newText("The experiment is over. Thank you for participating!<br>You can now close this page.")
        .print("center at 50vw","middle at 50vh")
    ,
    // Stay on this page forever
    newButton().wait()
)