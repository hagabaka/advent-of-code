TOTAL = 150

containers = DATA.readlines.map(&:to_i)
ways = (0...containers.length).reduce([]) do |combinations, length|
  combinations + containers.combination(length).select do |selected_containers|
    selected_containers.reduce(:+) == TOTAL
  end
end
answer = ways.group_by(&:length).min_by {|length, combinations| length}[1].length
puts answer
__END__
50
44
11
49
42
46
18
32
26
40
21
7
18
43
10
47
36
24
22
40
