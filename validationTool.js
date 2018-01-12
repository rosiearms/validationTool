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

  //create a function that splits array into what it needs to contain and what it can't contain if it has an OR operator...

  function determineRule(rule, array1, array2, sliceNum) {
    array2.push(rule[2]);
    let beforeOr = rule.slice(sliceNum, rule.indexOf('||'));
    let afterOr = rule.slice(rule.indexOf('||'));
    beforeOr.forEach((val) => {
      if (/[a-z]/gi.test(val)) array1.push(val);
    });
    afterOr.forEach((val) => {
      if (/[a-z]/gi.test(val)) array2.push(val);
    });
  }

  //call function on new rule and also check rules without an OR operator

  if (newRuleArr[1] === '=') {
    newOrContains.push(newRuleArr[0])
    if (/[||]/.test(newRuleArr)) {
      determineRule(newRuleArr, newMustContain, newOrContains, 0)
    } else {
      newRuleArr.forEach((val) => {
        if (/[a-z]/gi.test(val)) newMustContain.push(val);
      });
    }
  } else if (newRuleArr[1] === '!=') {
    newMustContain.push(newRuleArr[0]);
    if (/[||]/.test(newRuleArr)) {
      determineRule(newRuleArr, newCantContain, newOrCantContain, 1)
    } else {
      let newRuleArrMinusFirst = newRuleArr.slice(1);
      newRuleArrMinusFirst.forEach((val) => {
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
      orContains.push(arrRule[0]);
      if (/[||]/.test(arrRule)) {
          determineRule(arrRule, mustContain, orContains, 0);
      }
      else {
        arrRule.forEach((val) => {
          if (/[a-z]/gi.test(val)) mustContain.push(val);
        });
      }
    }

    else if (arrRule[1] === '!=') {
      mustContain.push(arrRule[0]);
      if (/[||]/.test(arrRule)) {
        determineRule(arrRule, cantContain, orCantContain, 1)
      }
      else {
       let arrRuleMinusFirst = arrRule.slice(1);
        arrRuleMinusFirst.forEach((val) => {
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

      //then check the rest of the rules - if they have one character matching in the must contain/orContains arrays, then check them against the cantContain fields to make sure nothing matches...

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
  
  //push a valid rule into the existing array if it's not there already, then give return statements for valid and invalid rules....

  if (isNewRuleValid === true) {
    if(existingRules.indexOf(newRule) === -1) existingRules.push(newRule);
    console.log(`This rule was valid, your new existing rules are ${existingRules}`)
    return isNewRuleValid;
  } else {
    console.log('sorry this rule is not valid as it contradicts an existing rule, please try again')
    return isNewRuleValid;
  }
}

module.exports = { validationTool };

