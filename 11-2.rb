password = 'hepxcrrq'

2.times do
  begin
    password.succ!
  end until
    password.chars.each_cons(3).any? do |first, second, third|
      first.succ == second && second.succ == third 
    end and
    password !~ /[iol]/ and
    password =~ /(.)\1.*(.)\2/
end

puts password

