function validationTool(newRule) {

  //create array for existing rules

  let existingRules = ['A = B && C', 'D = E && F || B', 'E = G || A'];

  //set a flag for the result of the rule check 

  let isNewRuleValid = true;

  //define arrays that will contain the newRules criteria

  let newMustContain = [];
  let newOrContains = [];
  let newCantContain = [];
  let newOrCantContain = [];

  //split the string into an array so each letter and each rule symbol are different elements of an array

  const newRuleArr = newRule.toLowerCase().split(' ');

  //create an error message if a rule without a valid format is provided

  if (newRuleArr.length < 3) return 'please make sure your rule has more than 2 characters';

  //go through the new rule array and seperate it into what it needs to contain, what it can't contain ect...

  if (newRuleArr[1] === '=') {
    if (/[||]/.test(newRuleArr)) {
      newOrContains.push(newRuleArr[0], newRuleArr[2]);
      let newBeforeOr = newRuleArr.slice(0, newRuleArr.indexOf('||'));
      let newAfterOr = newRuleArr.slice(newRuleArr.indexOf('||'));
      newBeforeOr.map((val) => {
        if (/[a-z]/gi.test(val)) newMustContain.push(val);
      });
      newAfterOr.map((val) => {
        if (/[a-z]/gi.test(val)) newOrContains.push(val);
      });
    } else {
      newRuleArr.map((val) => {
        if (/[a-z]/gi.test(val)) newMustContain.push(val);
      });
    }
  } else if (newRuleArr[1] === '!=') {
    newMustContain.push(newRuleArr[0]);
    if (/[||]/.test(newRuleArr)) {
      newOrCantContain.push(newRuleArr[2]);
      let newBeforeCantOr = newRuleArr.slice(1, newRuleArr.indexOf('||'));
      let newAfterCantOr = newRuleArr.slice(newRuleArr.indexOf('||'));
      newBeforeCantOr.map((val) => {
        if (/[a-z]/gi.test(val)) newCantContain.push(val);
      });
      newAfterCantOr.map((val) => {
        if (/[a-z]/gi.test(val)) newOrCantContain.push(val);
      });
    } else {
      newRuleArrMinusFirst = newRuleArr.slice(1);
      newRuleArrMinusFirst.map((val) => {
        if (/[a-z]/gi.test(val)) newCantContain.push(val);
      });
    }
  }


  //map through existing rules and split them into what they must contain, can't contain etc using same logic as above

  existingRules.map((rule) => {
    const arrRule = rule.toLowerCase().split(' ');
    let mustContain = [];
    let orContains = [];
    let cantContain = [];
    let orCantContain = [];


    if (arrRule[1] === '=') {
      if (/[||]/.test(arrRule)) {
        orContains.push(arrRule[0], arrRule[2]);
        let beforeOr = arrRule.slice(0, arrRule.indexOf('||'));
        let afterOr = arrRule.slice(arrRule.indexOf('||'));
        beforeOr.map((val) => {
          if (/[a-z]/gi.test(val)) mustContain.push(val);
        });
        afterOr.map((val) => {
          if (/[a-z]/gi.test(val)) orContains.push(val);
        });
      }
      else {
        arrRule.map((val) => {
          if (/[a-z]/gi.test(val)) mustContain.push(val);
        });
      }
    }

    else if (arrRule[1] === '!=') {

      mustContain.push(arrRule[0]);

      if (/[||]/.test(arrRule)) {
        orCantContain.push(arrRule[2]);
        let beforeCantOr = arrRule.slice(1, arrRule.indexOf('||'));
        let afterCantOr = arrRule.slice(arrRule.indexOf('||'));
        beforeCantOr.map((val) => {
          if (/[a-z]/gi.test(val)) cantContain.push(val);
        });
        afterCantOr.map((val) => {
          if (/[a-z]/gi.test(val)) orCantContain.push(val);
        });
      }
      else {
        arrRuleMinusFirst = arrRule.slice(1);
        arrRuleMinusFirst.map((val) => {
          if (/[a-z]/gi.test(val)) cantContain.push(val);
        });
      }
    }

    //check the base products first, if the first letter is the same in each array then they have the same base product.....

    if (mustContain[0] === newMustContain[0]) {
      if (newMustContain.length === 1) isNewRuleValid = true;
      else {
        if (newMustContain.slice(1).sort().toString() != mustContain.slice(1).sort().toString()) return isNewRuleValid = false;
        if (newOrContains.slice(1).sort().toString() != orContains.slice(1).sort().toString()) return isNewRuleValid = false;
      }
      
      for (let i = 0; i < mustContain.length; i++) {
        for (let j = 0; j < newCantContain.length; j++) {
          if (mustContain[i] === newCantContain[j]) return isNewRuleValid = false;
        }
      }
      for (let i = 0; i < newOrCantContain.length; i++) {
        for (let j = 0; j < mustContain.length; j++) {
          if (mustContain[j] === newOrCantContain[j]) return isNewRuleValid = false;
        }
      }
      for (let i = 0; i < orContains.length; i++) {
        for (let j = 0; j < newCantContain.length; j++) {
          if (orContains[i] === newCantContain[j]) return isNewRuleValid = false;
        }
      }
      for (let i = 0; i < newOrCantContain.length; i++) {
        for (let j = 0; j < orContains.length; j++) {
          if (orContains[j] === newOrCantContain[j]) return isNewRuleValid = false;
        }
      }

      //then check the rest of the rules - if they have one character matching in the must contain/or contains arrays, the check them against the can't contain fields to make sure nothing matches...

    } else if ((mustContain.indexOf(newRule[0].toLowerCase()) !== -1)) {
     let allContains = mustContain.concat(orContains);
     let allCantContain = cantContain.concat(orCantContain);
     let newAllContains = newMustContain.concat(newOrContains);
     let newAllCantContain = newCantContain.concat(newOrCantContain);
     for (let i = 0; i < allContains.length; i++) {
       if ((newAllCantContain.indexOf(allContains[i]) !== -1)) return isNewRuleValid = false;
     }
    }
  });
  
  //return statements for valid and invalid rules....

  if (isNewRuleValid === true) {
    existingRules.push(newRule);
    console.log(`This rule was valid, your new existing rules are ${existingRules}`)
    return isNewRuleValid;
  } else {
    console.log('sorry this rule is not valid as it contradicts an existing rule, please try again')
    return isNewRuleValid;
  }
}

module.exports = { validationTool };

