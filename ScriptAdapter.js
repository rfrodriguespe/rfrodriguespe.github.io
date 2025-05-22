var role = ecm.model.desktop.currentRole.name; // Pega a role atual do usuário
var allowedRoles = {
  "BO Distributeur BP": ["Acte de gestion", "Demande éligibilité"],
  "Autre Role": ["Revue périodique", "Souscription"]
};

// Aguarda o carregamento do botão
require(["icm/util/LaunchAction", "icm/model/CaseLaunchAction"], function(LaunchAction, CaseLaunchAction) {
  // Encontra o botão pelo nome
  var pageWidgets = payload.pagePayload.pageModel.page.widgets;
  for (var i = 0; i < pageWidgets.length; i++) {
    var widget = pageWidgets[i];
    if (widget.name === "CreateCase") { // ou o nome real do widget de criação
      widget.setActionFilter(function(actions) {
        var allowed = allowedRoles[role] || [];
        return actions.filter(function(action) {
          return allowed.indexOf(action.label) !== -1;
        });
      });
    }
  }
});
