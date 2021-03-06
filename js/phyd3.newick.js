/**
 * Newick format parser in JavaScript.
 * Modified version with autogenerated IDs.
 *
 * Copyright (c) Jason Davies 2010.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Example tree (from http://en.wikipedia.org/wiki/Newick_format):
 *
 * +--0.1--A
 * F-----0.2-----B            +-------0.3----C
 * +------------------0.5-----E
 *                            +---------0.4------D
 *
 * Newick format:
 * (A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F;
 *
 * Converted to JSON:
 * {
 *   name: "F",
 *   id: 1,
 *   branchset: [
 *     {name: "A", length: 0.1, id: 2},
 *     {name: "B", length: 0.2, id: 3},
 *     {
 *       name: "E",
 *       length: 0.5,
 *       id: 4,
 *       branchset: [
 *         {name: "C", length: 0.3, id: 5},
 *         {name: "D", length: 0.4, id: 6}
 *       ]
 *     }
 *   ]
 * }
 *
 */
(function() {
  if (typeof phyd3 == "undefined") phyd3 = {};
    phyd3.newick = {};
    phyd3.newick.parse = function(s) {
      var ancestors = [];
      var tree = {};
      var tokens = s.split(/\s*(;|\(|\)|,|:)\s*/);
      var cid = 0;
      for (var i=0; i<tokens.length; i++) {
        var token = tokens[i];
        switch (token) {
          case '(': // new branchset
            var subtree = {};
            tree.id = cid;
            cid++;
            tree.branchset = [subtree];
            ancestors.push(tree);
            tree = subtree;
            break;
          case ',': // another branch
            var subtree = {};
            ancestors[ancestors.length-1].branchset.push(subtree);
            tree = subtree;
            break;
          case ')': // optional name next
            tree = ancestors.pop();
            break;
          case ':': // optional length next
            break;
          default:
            var x = tokens[i-1];
            if (x == ')' || x == '(' || x == ',') {
              tree.name = token;
            } else if (x == ':') {
              tree.branchLength = parseFloat(token);
            }
            tree.id = cid;
            cid++;
        }
      }
      return tree;
    };
}());
