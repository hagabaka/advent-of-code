require_relative 'parse-structs'
@fields = [:capacity, :durability, :flavor, :texture, :calories]
@ingredients = parse_structs('Ingredient', *@fields)

def score(*quantities)
  @fields[0..-2].reduce(1) do |product, field|
    factor = @ingredients.zip(quantities).reduce(0) do |sum, (ingredient, quantity)|
      sum + ingredient[field] * quantity
    end
    product * [factor, 0].max
  end
end

require_relative 'find-max'
0.upto(100) do |a|
  0.upto(100 - a) do |b|
    0.upto(100 - a - b) do |c|
      d = 100 - a - b - c
      find_max(score(a, b, c, d))
    end
  end
end

__END__
Sprinkles: capacity 2, durability 0, flavor -2, texture 0, calories 3
Butterscotch: capacity 0, durability 5, flavor -3, texture 0, calories 3
Chocolate: capacity 0, durability 0, flavor 5, texture -1, calories 8
Candy: capacity 0, durability -1, flavor 0, texture 5, calories 8
