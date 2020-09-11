#=

This is the code for spawning a jupyter cell in a thread.

The main difficulty with doing this is that we need to be sure that 
the variables that are being set in the cell are not also being changed elsewhere.

So, we begin by trying to discover the names of all the variables in the cell,
and then renaming them to unique names (using gensym).
We then run with those unique names.

When we are finished, we need to
* capture and return ans, (maybe not return it)
* 
* clean up those names, 

to do:
clean up names after,
make threaded (is that an issue)?

=#


"""
The goal of extract_symbols is to find all the variables that we need to rename.
Ideally, it would do exactly this.  Right now it probably doesn't.
It returns them in a Set of Symbols.
"""
function extract_symbols(ex::Expr) 
    start = ex.head == :macrocall ? 2 : 1
    union((extract_symbols(arg) for arg in ex.args[start:end])...)
end
extract_symbols(ex::Symbol) = Set{Symbol}([ex])
extract_symbols(ex) = Set{Symbol}()

"""
    var_to_tmp, tmp_to_var = variable_maps(varlist)

Create maps to new names for the variables in varlist.
"""
function variable_maps(varlist)
    var_to_tmp = Dict{Symbol,Symbol}()
    tmp_to_var = Dict{Symbol,Symbol}()

    for s in varlist
        gs = gensym(s)
        var_to_tmp[s] = gs
        tmp_to_var[gs] = s
    end

    return var_to_tmp, tmp_to_var
end

"""
    mapped_ex = subs_variables(ex::Expr, mapping::Dict)

Go through the Expr and use mapping to replace every symbol 
discovered by extract_symbols.
"""
subs_variables(ex, mapping) = ex
subs_variables(s::Symbol, mapping::Dict) = 
    haskey(mapping, s) ? esc(mapping[s]) : s        
function subs_variables(ex::Expr, mapping::Dict) 
    start = ex.head == :macrocall ? 2 : 1 
    Expr(ex.head, (subs_variables(a, mapping) for a in ex.args[start:end])...)   
end

"""
Creates a block that when executed sandboxes all copyable variables.
"""
function sandbox_variable_block(varlist, var_to_tmp)
    exs = []

    for (s, t) in var_to_tmp       
        ss = """\"$(s)\""""
        q = Meta.parse("""isdefined(Main, Symbol($ss))""")        
        push!(exs, quote if $q 
                if can_copy(@eval Main $(s))
                    $(esc(t)) = deepcopy(@eval Main $(s))
                else
                    $(esc(t)) = $(esc(s))
                end
                end end)
    end 

    ex = Expr(:block)
    ex.args = exs

    return ex
end

"""
Creates a block that when executed saves the tmp vars in `past`.
"""
function save_state_block(var_to_tmp)
    exs = []
    exs = push!(exs,:(this_state = Dict{Any,Any}()))


    for (k, s) in var_to_tmp
        println(k, " ", s, " ", can_copy(@eval Main $k)) 

        ss = """\"$(s)\""""
        kk = """$(k)"""

        ss2 = "\$($(s))"


        #q = Meta.parse("""this_state[Symbol($kk)] = eval(Symbol($(ss)))""")
        #q = :(this_state[Symbol($(esc(kk)))] = can_copy($(esc(s))) ? deepcopy($(esc(s))) : nothing )
        q = quote  if can_copy($(esc(s)))
            this_state[Symbol($(esc(kk)))] =  deepcopy($(esc(s))) 
        end
        end
        push!(exs, q)
    end     



    #push!(exs, Symbol("this_state"))    

    ex = Expr(:block)
    ex.args = exs

    return ex
end

#=

this_state[Symbol($kk)] = esc($s)

q = Meta.parse("""if isdefined(IJuliaTimeMachine,Symbol($ss))
            this_state[Symbol($kk)] = deepcopy(eval(Symbol($ss)))
        end""")   
        =#

# IJuliaTimeMachine.add_tmpvar_to_dict(Symbol($ss), Symbol($kk), this_state)


"""
Creates a block that when executed sets all tmp variables to nothing
"""
function clear_block(var_to_tmp)
    exs = []

    for s in collect(values(var_to_tmp))
        ss = """\"$(s)\""""
        q = Meta.parse("""isdefined(Main, Symbol($ss))""")        
        push!(exs, quote if $q 
                $(esc(s)) = nothing
                end end)
    end 

    ex = Expr(:block)
    ex.args = exs

    return ex
end



"""
    ans = TM.@sandbox begin
        expression
    end

Run expression in a sandbox.  
Rename all the variables beforehand, and clear the renamed variables after.
Mainly wrote this to test concepts.  But, it could be useful anyway
"""
macro sandbox(ex::Expr)

    varlist = extract_symbols(ex)

    var_to_tmp, tmp_to_var = variable_maps(varlist)

    ex_rename = rename_block(varlist, var_to_tmp)
    ex_new = subs_variables(ex, var_to_tmp)
    ex_clear = clear_block(var_to_tmp)

    return quote
        @eval Main $ex_rename
        local val = @eval Main $ex_new
        @eval Main $ex_clear
        val
    end
end




macro tst(ex::Expr)
    varlist = extract_symbols(ex)
    var_to_tmp, tmp_to_var = variable_maps(varlist)
    for (k,s) in var_to_tmp
        println(k, " ", s)
    end
    ex_new = subs_variables(ex, var_to_tmp)
end

macro tst2(ex::Expr)
    varlist = extract_symbols(ex)
    var_to_tmp, tmp_to_var = variable_maps(varlist)
    for (k,s) in var_to_tmp
        println(k, " ", s)
    end
    ex_rename = rename_block(varlist, var_to_tmp)
    ex_new = subs_variables(ex, var_to_tmp)
    return quote
        $(ex_rename)
        $(ex_new)
    end
end

"""
    TM.@spawn begin
        code you want to run
    end

Spawns a process that runs your code, and eventually saves the result when it finishes
in `Out[cellnum]`.  It copies variables, so that changes to those variables do not interact with other cells.
"""
macro spawn(ex::Expr)

    local n = IJulia.n
    println(n)

    varlist = extract_symbols(ex)

    println(varlist)

    var_to_tmp, tmp_to_var = variable_maps(varlist)

    ex_rename = sandbox_variable_block(varlist, var_to_tmp)
    ex_new = subs_variables(ex, var_to_tmp)
    ex_clear = clear_block(var_to_tmp)

    ex_save = save_state_block(var_to_tmp)

    q = Meta.parse("""
        Threads.@spawn begin
            local val = $(ex_new)
            valc = nothing
            try
                valc = deepcopy(val)
            catch
            end
            IJulia.Out[$(n)] = valc
            $(ex_save)
            past[$n] = IJulia_State(this_state, valc)
        end
        """)        

        # need to put the clear inside the spawn
        # it works without a Threads.@spawn in front of the begin.  With it, we have trouble.
        # and, the problem is with things like a = a + 1.  
    return quote
        push!(running, $n)
        $(ex_rename)
        Threads.@spawn begin    
            val = $(ex_new)
            sleep(0.1)
            IJulia.Out[$(n)] = val
            $(ex_save)
            past[$n] = IJulia_State(this_state, val)

            push!(finished, $n)
            $n ∈ running && delete!(running, $n)
        end
    end

end



#=

        $ex_rename
        val = $(ex_new)
        IJulia.Out[$(n)] = val
        $(ex_save)
        past[$n] = IJulia_State(this_state, val)

    q = Meta.parse("""
        println("xx")
        Threads.@spawn begin
        local val = $(ex_new)
        IJulia.Out[$n] = val

        end
       """)

        try
            valc = deepcopy(val)
        catch
            valc = nothing
        end

        #$(ex_save)
        #past[$n] = IJulia_State(this_state, valc)

=#

macro badspawn(ex::Expr)

    local n = IJulia.n
    println(n)

    varlist = extract_symbols(ex)

    var_to_tmp, tmp_to_var = variable_maps(varlist)

    #ex_save = save_state_block(var_to_tmp)
    
    q = Meta.parse("""
        Threads.@spawn begin
        local val = $(ex)
        IJulia.Out[$n] = val

        end
       """)

    return quote
        $q
    end

end


function test(varlist)
    exs = []

    for s in varlist
        ss = """\"$(s)\""""
        q = Meta.parse("""isdefined(Main, Symbol($ss))""")        
        push!(exs, quote if $q 
                println($s)
                end end)
    end 

    ex = Expr(:block)
    ex.args = exs

    return ex
end   

function test1(varlist)
    exs = []

    for s in varlist
        ss = """\"$(s)\""""
        q = Meta.parse("""isdefined(Main, Symbol($ss))""")        
        push!(exs, quote if $q 
                println(Symbol($ss))
                end end)
    end 

    ex = Expr(:block)
    ex.args = exs

    return ex
end   

function test1(var_to_tmp::Dict)
    exs = []

    for (k, s) in var_to_tmp
        ss = """\"$(s)\""""
        q = Meta.parse("""isdefined(Main, Symbol($ss))""")        
        push!(exs, quote if $q 
                println(Symbol($ss))
                end end)
    end 

    ex = Expr(:block)
    ex.args = exs

    return ex
end   

