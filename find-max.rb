@max ||= 0
def find_max(n)
  if n > @max
    @max = n
    puts @max
  end
  @max
end
