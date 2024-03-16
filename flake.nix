{
  description = "line-tv-bot";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
  };

  outputs =
    { nixpkgs
    , flake-utils
    , ...
    }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
      deps = with pkgs; [
        nodejs
        yarn-berry
        serverless
        biome
      ];
      shellHook = ''
        yarn
      '';
    in
    {
      devShells = {
        default = pkgs.mkShell {
          inherit system shellHook;
          buildInputs = deps;
        };
      };
    });
}
