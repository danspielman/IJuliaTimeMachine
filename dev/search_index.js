var documenterSearchIndex = {"docs":
[{"location":"home/","page":"Home","title":"Home","text":"CurrentModule = IJuliaTimeMachine","category":"page"},{"location":"home/#IJuliaTimeMachine","page":"Home","title":"IJuliaTimeMachine","text":"","category":"section"},{"location":"home/","page":"Home","title":"Home","text":"An overview of IJuliaTimeMachine may be found here.\nAn example of its use inside a Jupyter notebook, along with some explanation of how it works, may be found in the examples directory or right here","category":"page"},{"location":"overview/#IJuliaTimeMachine","page":"Overview","title":"IJuliaTimeMachine","text":"","category":"section"},{"location":"overview/","page":"Overview","title":"Overview","text":"This package provides two capabilities that can be  useful when running long computational experiments in IJulia notebooks:","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"It allows you to return all variables to a previous state (the past).","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"This is useful if you run experiments in Julia cells that can take minutes or longer to complete, and want to re-examine the variables in a cell you have over-written.","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"It allows you to spawn a process to run on another thread while you keep writing other cells (the future).","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"The process sandboxes the variables it uses, so it does not impact other cells. This is especially useful if you plan to run many similar experiments.   Now, you can just copy, paste and modify cells before running them.","category":"page"},{"location":"overview/#Installation","page":"Overview","title":"Installation","text":"","category":"section"},{"location":"overview/","page":"Overview","title":"Overview","text":"using Pkg; Pkg.add(url=\"https://github.com/danspielman/IJuliaTimeMachine.jl\")","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"Once you are running a Jupyter notebook, you can start the time machine by typing","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"import IJuliaTimeMachine","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"As the name of the package is rather long, and all of its commands require it as a prefix, I recommend renaming it like","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"TM = IJuliaTimeMachine","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"The rest of these docs assume you have renamed it to TM.","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"If you use the Time Machine a lot, and don't want to type TM, all the time, you can instead type","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"using IJuliaTimeMachine","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"This will export the function vars and the macro @past.","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"To check how many threads you have available, type","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"> Threads.nthreads()","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"If you only have one, but should have more, then you have to do some configuration.","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"To make sure that your Jupyter notebook starts with threads,  and you are running Jupyter from a cell, you could type","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"export JULIA_NUM_THREADS=4\njupyter notebook","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"Or, on a Mac, put the following line in the file ~/.profile:","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"export JULIA_NUM_THREADS=2","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"Of course, replace 2 or 4 with the number of threads you should have.  Usually, this is twice the number of cores. To find out how many this could be, you could start Julia with the -t auto option, and then check how many threads it chooses to start with.","category":"page"},{"location":"overview/#Basic-Usage","page":"Overview","title":"Basic Usage","text":"","category":"section"},{"location":"overview/","page":"Overview","title":"Overview","text":"First, note that IJulia already provides some history functionality. It maintains dictionaries In and Out that store the input (contents) and output (ans) of every cell. To see the answer computed in cell 20, examine Out[20].","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"To go back to the state as it was after cell 20, at any time, type TM.@past 20.","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"If you just want to look at a dictionary of the variables from cell 20, type TM.vars(20).","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"To stop saving state, type TM.saving!(false).  This is especially useful if IJuliaTimeMachine is causing errors. To start up again, type TM.saving!(true). If you want to turn off IJuliaTimeMachine, run TM.unhook().","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"To prevent IJuliaTimeMachine from saving a variable x, run TM.dontsave(x).","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"If you need to free up memory, type TM.clear_past() to clear all the saved state information. TM.clear_past(cells) clears the states in the iterator (or range) given by cells. It also clears all variables that are saved only in those states. ","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"All of the saved data is kept in a structure that we internally call a Varchive. It is stored at TM.VX. If you want to save all variables so that you can recover them when restarting Jupyter, save this variable. For example, using ","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"bson(\"vars from this notebook.bson\", VX = TM.VX)","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"You can then load and access dictionaries of those variables using TM.vars(VX, n). Say, to get the variables from cell 10, you could type","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"VXold = BSON.load(\"vars from this notebook.bson\")[:VX]\nTM.vars(VXold, 10)","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"If picking variables out of that dictionary is too slow for you, you can emulate the @past macro and put all the variables from the dictionary into Main by typing","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"TM.@dict_to_main(TM.vars(VXold,10))","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"Of course, you can use any dictionary in place of TM.vars(VXold,10).","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"You can run code in a thread by using TM.@thread.  It can be used at most once per cell. Examples are like.","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"TM.@thread my_intensive_function(x)","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"TM.@thread begin\n    a number of computationally intense lines\nend","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"TM.running keeps track of cells that are running. TM.finished of course keeps track of those that stopped.","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"By default, notifications about finished cells are printed to the terminal from which Jupyter was started.  You can turn this on or off with TM.notify_terminal!().   You can choose to have notifications printed to the current Jupyter cell by setting TM.notify_jupyter!(true).","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"You can find a demonstration of the time machine in action in the [examples directory](https://github.com/](https://github.com/danspielman/IJuliaTimeMachine.jl/tree/master/examples). It is saved as a Jupyter notebook, html, and pdf.","category":"page"},{"location":"overview/#In-case-of-errors","page":"Overview","title":"In case of errors","text":"","category":"section"},{"location":"overview/","page":"Overview","title":"Overview","text":"If IJuliaTimeMachine develops problems, it can cause strange errors to appear in every cell. The usual reason is some type of variable that it does not know how to handle. The easy solution is to prevent saving of that variable with dontsave.","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"If that doesn't fix it, you will probably want to disable the Time Machine. The following command does this","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"TM.unhook()","category":"page"},{"location":"overview/#Contributing","page":"Overview","title":"Contributing","text":"","category":"section"},{"location":"overview/","page":"Overview","title":"Overview","text":"Please help improve this. Someone who understands Julia Macros and internals could do a much better job of this. Feel free to file issues, create pull requests, or get in touch with daniel.spielman@yale.edu if you can improve it. Here are some things that would be worth doing:","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"Find a way to copy and save functions \nCreate a GUI to keep track of which spawned processes are running, and which have finished.\nThink of what other features this needs.\nFigure out a way to create tests for this package. The difficulty is that it needs to run inside Jupyter.","category":"page"},{"location":"overview/#Known-Issues","page":"Overview","title":"Known Issues","text":"","category":"section"},{"location":"overview/","page":"Overview","title":"Overview","text":"Output from @thread that is supposed to go to stdout winds up in whatever cell is current.","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"It would be terrific to capture this instead, and ideally make it something we can play back later.","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"Sometimes we get an error that says error in running finalizer: ErrorException(\"concurrency violation detected\").  Not sure why.","category":"page"},{"location":"overview/#Details-/-how-it-works","page":"Overview","title":"Details / how it works","text":"","category":"section"},{"location":"overview/","page":"Overview","title":"Overview","text":"Time Machine only saves variables that are in Main.  ","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"It stores them in TM.VX. The data structure is described in varchive.jl.","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"The Time Machine only saves variables that can be copied with deepcopy.  In particular, it does not save functions.  It would be nice to add a way to copy functions. \nIt keeps track of these variables by hashes (using tm_hash, which is more robust than Base.hash). So, if two variables store data that has the same hash, one of them will be lost. This is unlikely to be a problem for most notebooks, because a heuristic probabilistic, analysis of hashing suggests that the chance of a collision when there are v variables is around v^2 / 2^64.\nThe state saving features work by using an IJulia postexecute_hook.","category":"page"},{"location":"overview/","page":"Overview","title":"Overview","text":"This would not work for processes launched with @thread because their postexecute hooks fire before the job finishes. So, those jobs finish by putting the data they should save into a queue. That data is then saved into VX during the preexecute phase of the next cell execution, using a preexecute hook. The queue is managed with a SpinLock so that two threads can not write to it at the same time.","category":"page"},{"location":"","page":"IJuliaTimeMachine","title":"IJuliaTimeMachine","text":"CurrentModule = IJuliaTimeMachine","category":"page"},{"location":"#IJuliaTimeMachine","page":"IJuliaTimeMachine","title":"IJuliaTimeMachine","text":"","category":"section"},{"location":"","page":"IJuliaTimeMachine","title":"IJuliaTimeMachine","text":"An overview of IJuliaTimeMachine may be found here.","category":"page"},{"location":"","page":"IJuliaTimeMachine","title":"IJuliaTimeMachine","text":"Modules = [IJuliaTimeMachine]","category":"page"},{"location":"docstrings/#The-intended-interface","page":"Docstrings","title":"The intended interface","text":"","category":"section"},{"location":"docstrings/","page":"Docstrings","title":"Docstrings","text":"@past\nvars\nIJuliaTimeMachine.dontsave\nIJuliaTimeMachine.ans\nIJuliaTimeMachine.@thread\nIJuliaTimeMachine.notify_jupyter!\nIJuliaTimeMachine.notify_terminal!\nIJuliaTimeMachine.unhook","category":"page"},{"location":"docstrings/#IJuliaTimeMachine.@past","page":"Docstrings","title":"IJuliaTimeMachine.@past","text":"@past n\n\nReturn to the state after cell n was exectued.\n\n\n\n\n\n","category":"macro"},{"location":"docstrings/#IJuliaTimeMachine.vars","page":"Docstrings","title":"IJuliaTimeMachine.vars","text":"vars(cell)\nvars(vx::Varchive, cell)\n\nReturns a dictionary of the variables from cell cell. If vx is omitted, returns from the default history. This is how it is usually used.\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#IJuliaTimeMachine.dontsave","page":"Docstrings","title":"IJuliaTimeMachine.dontsave","text":"dontsave(x)\n\nDo not save variable x in the history.\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#IJuliaTimeMachine.ans","page":"Docstrings","title":"IJuliaTimeMachine.ans","text":"Recall the answer from a cell\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#IJuliaTimeMachine.@thread","page":"Docstrings","title":"IJuliaTimeMachine.@thread","text":"TM.@thread begin\n    code you want to run\nend\n\nSpawns a process that runs your code in its own thread, and eventually saves the result when it finishes in Out[cellnum].  It copies variables, so that changes to those variables do not interact with other cells.\n\n\n\n\n\n","category":"macro"},{"location":"docstrings/#IJuliaTimeMachine.notify_jupyter!","page":"Docstrings","title":"IJuliaTimeMachine.notify_jupyter!","text":"notify_jupyter!(bool)\n\nIf true, Print notifications about finishing jobs to the current jupyter output cell.\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#IJuliaTimeMachine.notify_terminal!","page":"Docstrings","title":"IJuliaTimeMachine.notify_terminal!","text":"notify_terminal!(bool)\n\nIf true, Print notifications about finishing jobs to the terminal from which jupyter was started.\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#IJuliaTimeMachine.unhook","page":"Docstrings","title":"IJuliaTimeMachine.unhook","text":"unhook()\n\nRemove the pre and postexecute hooks created by Time Machine. Made for when the Time Machine is causing strange errors. These typically cause strange errors to happen whenever a cell is executed.\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#All-Docstrings","page":"Docstrings","title":"All Docstrings","text":"","category":"section"},{"location":"docstrings/","page":"Docstrings","title":"Docstrings","text":"Modules = [IJuliaTimeMachine]","category":"page"},{"location":"docstrings/#IJuliaTimeMachine.ans-Tuple{Int64}","page":"Docstrings","title":"IJuliaTimeMachine.ans","text":"Recall the answer from a cell\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.can_copy-Tuple{Any}","page":"Docstrings","title":"IJuliaTimeMachine.can_copy","text":"can_copy(x)\n\nIs supposed to return true if deepcopy works on x. The code to test this is based on deepcopy, but it could get some strange case wrong.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.clear_past-Tuple{}","page":"Docstrings","title":"IJuliaTimeMachine.clear_past","text":"clear_past(indices)\n\nEmpty all storage of the past.  Use to free up memory. If indices is omitted, it clears all history.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.dontsave-Tuple{Any}","page":"Docstrings","title":"IJuliaTimeMachine.dontsave","text":"dontsave(x)\n\nDo not save variable x in the history.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.extract_symbols-Tuple{Expr}","page":"Docstrings","title":"IJuliaTimeMachine.extract_symbols","text":"The goal of extract_symbols is to find all the variables that appear in a block. It returns them in a Set of Symbols. This will return many more symbols than we want, so we only save those that we can copy.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.let_block-Tuple{Any}","page":"Docstrings","title":"IJuliaTimeMachine.let_block","text":"Creates the let statement for all copyable variables.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.main_to_dict-Tuple{}","page":"Docstrings","title":"IJuliaTimeMachine.main_to_dict","text":"Go over every symbol in Main.   If deepcopy works on it, put it in the dict d. Note that it doesn't capture functions, which is unfortunate.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.notify_jupyter!-2","page":"Docstrings","title":"IJuliaTimeMachine.notify_jupyter!","text":"notify_jupyter!(bool)\n\nIf true, Print notifications about finishing jobs to the current jupyter output cell.\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#IJuliaTimeMachine.notify_terminal!-2","page":"Docstrings","title":"IJuliaTimeMachine.notify_terminal!","text":"notify_terminal!(bool)\n\nIf true, Print notifications about finishing jobs to the terminal from which jupyter was started.\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#IJuliaTimeMachine.put_state!-Tuple{IJuliaTimeMachine.Varchive,Any,Dict,Any}","page":"Docstrings","title":"IJuliaTimeMachine.put_state!","text":"put_state!(vx::Varchive, key, di::Dict, ansc)\n\nAssuming that state indexed by key (=n) is packed into ijstate, put it into the Varchive.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.put_state_copied!-Tuple{IJuliaTimeMachine.Varchive,Any,Dict,Any}","page":"Docstrings","title":"IJuliaTimeMachine.put_state_copied!","text":"put_state_copied!(vx::Varchive, key, di::Dict, ansc)\n\nAssuming that state indexed by key (=n) is packed into ijstate, put it into the Varchive.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.save_state-Tuple{}","page":"Docstrings","title":"IJuliaTimeMachine.save_state","text":"Save the current variables and ans in VX (a Varchive).\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.save_state_block-Tuple{Any}","page":"Docstrings","title":"IJuliaTimeMachine.save_state_block","text":"Creates a block that when executed saves the used variables in VX.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.saving!","page":"Docstrings","title":"IJuliaTimeMachine.saving!","text":"saving!(bool)\n\nTurn saving of state on or off.  Works by pushing or poping an IJulia postexecute_hook. True by default.\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#IJuliaTimeMachine.tm_hash-Tuple{Any}","page":"Docstrings","title":"IJuliaTimeMachine.tm_hash","text":"tm_hash(x)\n\nProduces a hash of any variable for which can_copy returns true. If variables x and y are different, they will probably have different hashes.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.unhook-Tuple{}","page":"Docstrings","title":"IJuliaTimeMachine.unhook","text":"unhook()\n\nRemove the pre and postexecute hooks created by Time Machine. Made for when the Time Machine is causing strange errors. These typically cause strange errors to happen whenever a cell is executed.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.vars-Tuple{IJuliaTimeMachine.Varchive,Any}","page":"Docstrings","title":"IJuliaTimeMachine.vars","text":"vars(cell)\nvars(vx::Varchive, cell)\n\nReturns a dictionary of the variables from cell cell. If vx is omitted, returns from the default history. This is how it is usually used.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#IJuliaTimeMachine.@dict_to_main-Tuple{Any}","page":"Docstrings","title":"IJuliaTimeMachine.@dict_to_main","text":"@dict_to_main dict\n\nPlace all variables in dict into Main memory.\n\n\n\n\n\n","category":"macro"},{"location":"docstrings/#IJuliaTimeMachine.@past-Tuple{Any}","page":"Docstrings","title":"IJuliaTimeMachine.@past","text":"@past n\n\nReturn to the state after cell n was exectued.\n\n\n\n\n\n","category":"macro"},{"location":"docstrings/#IJuliaTimeMachine.@thread-Tuple{Expr}","page":"Docstrings","title":"IJuliaTimeMachine.@thread","text":"TM.@thread begin\n    code you want to run\nend\n\nSpawns a process that runs your code in its own thread, and eventually saves the result when it finishes in Out[cellnum].  It copies variables, so that changes to those variables do not interact with other cells.\n\n\n\n\n\n","category":"macro"}]
}
