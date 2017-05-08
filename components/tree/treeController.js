app.controller("treeController", function($scope, $http){
	
	$scope.$watch("subdata", function(newValue, oldValue){
		
		console.log("[TREE] WATCH", oldValue, newValue);
		
		if(newValue != oldValue){
			
//			console.log("[TREE]", newValue);
			
			var newick = newValue;
			
			console.log("D3", d3.layout.phylotree);
			
			var tree = d3.layout.phylotree().svg(d3.select("#tree")).radial(true);
			
			console.log("TREE", tree)
			
			// console.log("TREE D3", error, newick, tree);
			
			var phylotree = tree(d3_phylotree_newick_parser(newick))
			
			console.log("[TREE]", phylotree);
			
			phylotree.layout();
		    // tree.radial($(this).prop("checked")).placenodes().update();
			
//			console.log("[CLOUD] ELEMENT DATA: ", $scope.subdata);
		}
	});
});