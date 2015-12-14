Reindeer = Struct.new('Reindeer', :name, :speed, :run, :rest, :remaining_run, :remaining_rest, :distance, :score)
reindeers = []
DATA.read.scan(/^([A-Z][a-z]+) .+ (\d+) .+ (\d+) .+ (\d+) .+$/) do |name, speed, run, rest|
  (speed, run, rest) = [speed, run, rest].map(&:to_i)
  reindeers << Reindeer.new(name, speed, run, rest, run, rest, 0, 0)
end
2503.times do
  reindeers.each do |reindeer|
    if reindeer.remaining_rest == 0
      reindeer.remaining_run = reindeer.run
      reindeer.remaining_rest = reindeer.rest
    end
    if reindeer.remaining_run > 0
      reindeer.remaining_run -= 1
      reindeer.distance += reindeer.speed
    else
      reindeer.remaining_rest -= 1
    end
  end
  lead = reindeers.max_by(&:distance).distance
  reindeers.select {|reindeer| reindeer.distance == lead}.each {|reindeer| reindeer.score += 1}
end

puts reindeers.max_by(&:distance).distance

__END__
Dancer can fly 27 km/s for 5 seconds, but then must rest for 132 seconds.
Cupid can fly 22 km/s for 2 seconds, but then must rest for 41 seconds.
Rudolph can fly 11 km/s for 5 seconds, but then must rest for 48 seconds.
Donner can fly 28 km/s for 5 seconds, but then must rest for 134 seconds.
Dasher can fly 4 km/s for 16 seconds, but then must rest for 55 seconds.
Blitzen can fly 14 km/s for 3 seconds, but then must rest for 38 seconds.
Prancer can fly 3 km/s for 21 seconds, but then must rest for 40 seconds.
Comet can fly 18 km/s for 6 seconds, but then must rest for 103 seconds.
Vixen can fly 18 km/s for 5 seconds, but then must rest for 84 seconds.
