TasksController.prototype.override({
    initialize: function ($super, parentEl, params) {
        $super(parentEl, params);
        // Squeeze window content always EXCEPT if the player is visible & at the bottom dock
        this.squeezeWindowContent = function () {
            var layout = uitools.getDocking().getCurrentLayout();
            if (!layout)
                return true;
            var isPlayerVisible = layout.isPanelVisible('mainPlayer');
            var playerLocation = layout.getPanelDock('mainPlayer');

            return !(isPlayerVisible && playerLocation && playerLocation.id === "mostBottomDock" && playerLocation.anyPanelVisible());
        }
    }
})
