import React from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Home from "./Home";
import View from "./View";

export function PageContainer() {
    return <Router>
        <div>
            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
                <Route path={`/r/:shortcode`}>
                    <View/>
                </Route>
                <Route path="/" exact>
                    <Home/>
                </Route>
                <Route component={()=><Redirect to="/" />} />
            </Switch>
        </div>
    </Router>;
}
