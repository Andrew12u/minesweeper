* Current selection of a blank square will lead to a stack overflow.  

* This might be due to border squares being squares that triggered the recursive
call in the first place. An attempt was made to account for this, but in
reality, perhaps all recursive callers (e.g. {row, col} squares that triggered
the recursive call) need to be set within state and checked against.

What's done:
1. Dynamic board generation
2. Finding count of nearby mines

What needs to be done:
1. Click expansion upon clicking a blank space.
   //toggle() probably needs to be modified to include *all* {row,col}
2. Win/loss notification
3. Cleanup
4. Testing
