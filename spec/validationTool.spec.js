const {expect} = require ('chai');
const {validationTool} = require ('../validationTool');
const sinon = require ('sinon');

describe('validationTool', () => {
 it('returns invalid input if a rule is not provided in the correct format', () => {
    expect(validationTool('A =')).to.equal('please make sure your rule has more than 2 characters');
  });
  it('measures whether a rule is valid if the rules have the same base product and they only specify what they can contain, without using an OR operator', () => {
    expect(validationTool('A = B')).to.equal(false);
    expect(validationTool('A = B && C')).to.equal(true);
    expect(validationTool('D = B')).to.equal(false);
    expect(validationTool('E = E')).to.equal(false);
    expect(validationTool('E = B && A')).to.equal(false);
  });
  it('measures whether a rule is valid if the rules have the same base product and they specify what they cannot contain, without using an OR operator', () => {
    expect(validationTool('A != B')).to.equal(false);
    expect(validationTool('A != D')).to.equal(true);
    expect(validationTool('A != D && B')).to.equal(false);
    expect(validationTool('D != E')).to.equal(false);
    expect(validationTool('D != B')).to.equal(false);
  });
  it('measures whether a rule is valid if the rules have the same base product and they only specify what they can contain, whilst using an OR operator', () => {
    expect(validationTool('A = B || D')).to.equal(false);
    expect(validationTool('A = B && C || F && E')).to.equal(false);
    expect(validationTool('D = E || F')).to.equal(false);
    expect(validationTool('D = E && F || B')).to.equal(true);
  });
  it('measures whether a rule is valid if the rules have the same base product and they only specify what they cannot contain, whilst using an OR operator', () => {
    expect(validationTool('A != B || C')).to.equal(false);
    expect(validationTool('A != D && E || B')).to.equal(false);
    expect(validationTool('A != E || F && G')).to.equal(true);
    expect(validationTool('D != E && F || B')).to.equal(false);
    expect(validationTool('D != G')).to.equal(true);
  });
  it('measures whether a rule is valid if the rules do not have the same base product', () => {
    expect(validationTool('G = E')).to.equal(true);
    expect(validationTool('G != E')).to.equal(false);
    expect(validationTool('F != A && D')).to.equal(false);
    expect(validationTool('C != D || E')).to.equal(true);
    expect(validationTool('C = E')).to.equal(true);
  });
});   